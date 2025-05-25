import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertTaskSchema, insertActivityLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = 1; // Mock user for now
      
      const campaigns = await storage.getCampaignsByUserId(userId);
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
      
      // Get today's analytics
      const today = new Date().toISOString().split('T')[0];
      const todayAnalytics = await storage.getAnalyticsByDate(userId, today);
      
      // Get week analytics for trends
      const weekAnalytics = await storage.getAnalyticsByUserId(userId);
      const lastWeekData = weekAnalytics.slice(-7);
      
      const totalConnectionsSent = lastWeekData.reduce((sum, a) => sum + (a.connectionsSent || 0), 0);
      const totalConnectionsAccepted = lastWeekData.reduce((sum, a) => sum + (a.connectionsAccepted || 0), 0);
      const totalContentShared = lastWeekData.reduce((sum, a) => sum + (a.contentShared || 0), 0);
      
      const responseRate = totalConnectionsSent > 0 ? (totalConnectionsAccepted / totalConnectionsSent * 100) : 0;
      
      const stats = {
        activeAutomations: activeCampaigns,
        connectionsSent: totalConnectionsSent,
        responseRate: responseRate.toFixed(1),
        contentShared: totalContentShared,
        connectionsToday: todayAnalytics?.connectionsSent || 0,
        weeklyTrend: {
          connections: lastWeekData.length > 1 ? "up" : "stable",
          responseRate: "down"
        }
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get analytics data for charts
  app.get("/api/analytics/performance", async (req, res) => {
    try {
      const userId = 1;
      const period = req.query.period as string || '7d';
      
      const analytics = await storage.getAnalyticsByUserId(userId);
      let filteredData = analytics;
      
      if (period === '7d') {
        filteredData = analytics.slice(-7);
      } else if (period === '30d') {
        filteredData = analytics.slice(-30);
      }
      
      const chartData = filteredData.map(a => ({
        date: a.date,
        connections: a.connectionsSent || 0,
        acceptances: a.connectionsAccepted || 0,
        engagement: (a.likesGiven || 0) + (a.commentsGiven || 0)
      }));
      
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Get campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const userId = 1;
      const campaigns = await storage.getCampaignsByUserId(userId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Create campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      const userId = 1;
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        userId
      });
      
      const campaign = await storage.createCampaign(campaignData);
      
      // Create activity log
      await storage.createActivityLog({
        userId,
        type: "campaign_created",
        title: "New automation campaign created",
        description: `Created "${campaign.name}" campaign`,
        status: "completed"
      });
      
      res.json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create campaign" });
      }
    }
  });

  // Update campaign status
  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      const campaign = await storage.updateCampaign(id, { status });
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: campaign.userId,
        type: "campaign_updated",
        title: `Campaign ${status}`,
        description: `"${campaign.name}" campaign was ${status}`,
        status: "completed"
      });
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Get activity log
  app.get("/api/activity", async (req, res) => {
    try {
      const userId = 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const activities = await storage.getActivityLogByUserId(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity log" });
    }
  });

  // Get user profile
  app.get("/api/user/profile", async (req, res) => {
    try {
      const userId = 1;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
