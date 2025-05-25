import { 
  users, 
  automationCampaigns,
  automationTasks,
  analytics,
  activityLog,
  type User, 
  type InsertUser,
  type AutomationCampaign,
  type InsertAutomationCampaign,
  type AutomationTask,
  type InsertAutomationTask,
  type Analytics,
  type InsertAnalytics,
  type ActivityLog,
  type InsertActivityLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Campaigns
  getCampaignsByUserId(userId: number): Promise<AutomationCampaign[]>;
  getCampaign(id: number): Promise<AutomationCampaign | undefined>;
  createCampaign(campaign: InsertAutomationCampaign): Promise<AutomationCampaign>;
  updateCampaign(id: number, updates: Partial<AutomationCampaign>): Promise<AutomationCampaign | undefined>;

  // Tasks
  getTasksByCampaignId(campaignId: number): Promise<AutomationTask[]>;
  getTasksByUserId(userId: number): Promise<AutomationTask[]>;
  createTask(task: InsertAutomationTask): Promise<AutomationTask>;
  updateTask(id: number, updates: Partial<AutomationTask>): Promise<AutomationTask | undefined>;

  // Analytics
  getAnalyticsByUserId(userId: number): Promise<Analytics[]>;
  getAnalyticsByDate(userId: number, date: string): Promise<Analytics | undefined>;
  createOrUpdateAnalytics(analytics: InsertAnalytics): Promise<Analytics>;

  // Activity Log
  getActivityLogByUserId(userId: number, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(activity: InsertActivityLog): Promise<ActivityLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, AutomationCampaign>;
  private tasks: Map<number, AutomationTask>;
  private analytics: Map<string, Analytics>; // key: userId-date
  private activityLogs: Map<number, ActivityLog>;
  private currentUserId: number;
  private currentCampaignId: number;
  private currentTaskId: number;
  private currentAnalyticsId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.tasks = new Map();
    this.analytics = new Map();
    this.activityLogs = new Map();
    this.currentUserId = 1;
    this.currentCampaignId = 1;
    this.currentTaskId = 1;
    this.currentAnalyticsId = 1;
    this.currentActivityId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const user: User = {
      id: 1,
      username: "john@company.com",
      password: "password",
      email: "john@company.com",
      name: "John Anderson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    };
    this.users.set(1, user);
    this.currentUserId = 2;

    // Create sample campaigns
    const campaigns = [
      {
        id: 1,
        userId: 1,
        name: "Sales Outreach Campaign",
        type: "connection",
        status: "active",
        settings: { dailyLimit: 25, targetRole: "Software Engineer" },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        name: "Content Engagement",
        type: "engagement",
        status: "scheduled",
        settings: { likesPerDay: 50, commentsPerDay: 12 },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 1,
        name: "Follow-up Messages",
        type: "message",
        status: "paused",
        settings: { messageTemplate: "Thanks for connecting!" },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    campaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign as AutomationCampaign);
    });
    this.currentCampaignId = 4;

    // Create sample analytics for the last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const analyticsData: Analytics = {
        id: this.currentAnalyticsId++,
        userId: 1,
        date: dateStr,
        connectionsSent: Math.floor(Math.random() * 20) + 30,
        connectionsAccepted: Math.floor(Math.random() * 10) + 8,
        messagesSeent: Math.floor(Math.random() * 15) + 10,
        contentShared: Math.floor(Math.random() * 3) + 1,
        likesGiven: Math.floor(Math.random() * 30) + 40,
        commentsGiven: Math.floor(Math.random() * 8) + 5
      };

      this.analytics.set(`${1}-${dateStr}`, analyticsData);
    }

    // Create sample activity logs
    const activities = [
      {
        id: 1,
        userId: 1,
        type: "connection_accepted",
        title: "Connection request accepted",
        description: "Sarah Johnson (Marketing Director at TechCorp) accepted your connection request",
        status: "success",
        createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      },
      {
        id: 2,
        userId: 1,
        type: "batch_connections",
        title: "Batch connection requests sent",
        description: "25 connection requests sent to Software Engineers in San Francisco",
        status: "completed",
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        id: 3,
        userId: 1,
        type: "content_shared",
        title: "Content shared successfully",
        description: '"5 Tips for Better LinkedIn Networking" post shared to your timeline',
        status: "posted",
        createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 4,
        userId: 1,
        type: "engagement_completed",
        title: "Engagement automation completed",
        description: "Liked 50 posts and commented on 12 posts from your network",
        status: "engaged",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    ];

    activities.forEach(activity => {
      this.activityLogs.set(activity.id, activity as ActivityLog);
    });
    this.currentActivityId = 5;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Campaign methods
  async getCampaignsByUserId(userId: number): Promise<AutomationCampaign[]> {
    return Array.from(this.campaigns.values()).filter(campaign => campaign.userId === userId);
  }

  async getCampaign(id: number): Promise<AutomationCampaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertAutomationCampaign): Promise<AutomationCampaign> {
    const id = this.currentCampaignId++;
    const now = new Date();
    const campaign: AutomationCampaign = {
      ...insertCampaign,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<AutomationCampaign>): Promise<AutomationCampaign | undefined> {
    const existing = this.campaigns.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.campaigns.set(id, updated);
    return updated;
  }

  // Task methods
  async getTasksByCampaignId(campaignId: number): Promise<AutomationTask[]> {
    return Array.from(this.tasks.values()).filter(task => task.campaignId === campaignId);
  }

  async getTasksByUserId(userId: number): Promise<AutomationTask[]> {
    const userCampaigns = await this.getCampaignsByUserId(userId);
    const campaignIds = userCampaigns.map(c => c.id);
    return Array.from(this.tasks.values()).filter(task => campaignIds.includes(task.campaignId));
  }

  async createTask(insertTask: InsertAutomationTask): Promise<AutomationTask> {
    const id = this.currentTaskId++;
    const task: AutomationTask = {
      ...insertTask,
      id,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<AutomationTask>): Promise<AutomationTask | undefined> {
    const existing = this.tasks.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  // Analytics methods
  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(a => a.userId === userId);
  }

  async getAnalyticsByDate(userId: number, date: string): Promise<Analytics | undefined> {
    return this.analytics.get(`${userId}-${date}`);
  }

  async createOrUpdateAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const key = `${insertAnalytics.userId}-${insertAnalytics.date}`;
    const existing = this.analytics.get(key);

    if (existing) {
      const updated = { ...existing, ...insertAnalytics };
      this.analytics.set(key, updated);
      return updated;
    } else {
      const id = this.currentAnalyticsId++;
      const analytics: Analytics = { ...insertAnalytics, id };
      this.analytics.set(key, analytics);
      return analytics;
    }
  }

  // Activity Log methods
  async getActivityLogByUserId(userId: number, limit = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivityLog(insertActivity: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityId++;
    const activity: ActivityLog = {
      ...insertActivity,
      id,
      createdAt: new Date()
    };
    this.activityLogs.set(id, activity);
    return activity;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCampaignsByUserId(userId: number): Promise<AutomationCampaign[]> {
    return await db.select().from(automationCampaigns).where(eq(automationCampaigns.userId, userId));
  }

  async getCampaign(id: number): Promise<AutomationCampaign | undefined> {
    const [campaign] = await db.select().from(automationCampaigns).where(eq(automationCampaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(insertCampaign: InsertAutomationCampaign): Promise<AutomationCampaign> {
    const [campaign] = await db
      .insert(automationCampaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<AutomationCampaign>): Promise<AutomationCampaign | undefined> {
    const [campaign] = await db
      .update(automationCampaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(automationCampaigns.id, id))
      .returning();
    return campaign || undefined;
  }

  async getTasksByCampaignId(campaignId: number): Promise<AutomationTask[]> {
    return await db.select().from(automationTasks).where(eq(automationTasks.campaignId, campaignId));
  }

  async getTasksByUserId(userId: number): Promise<AutomationTask[]> {
    const userCampaigns = await this.getCampaignsByUserId(userId);
    const campaignIds = userCampaigns.map(c => c.id);
    if (campaignIds.length === 0) return [];
    
    return await db.select().from(automationTasks).where(eq(automationTasks.campaignId, campaignIds[0])); // simplified for now
  }

  async createTask(insertTask: InsertAutomationTask): Promise<AutomationTask> {
    const [task] = await db
      .insert(automationTasks)
      .values(insertTask)
      .returning();
    return task;
  }

  async updateTask(id: number, updates: Partial<AutomationTask>): Promise<AutomationTask | undefined> {
    const [task] = await db
      .update(automationTasks)
      .set(updates)
      .where(eq(automationTasks.id, id))
      .returning();
    return task || undefined;
  }

  async getAnalyticsByUserId(userId: number): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.userId, userId)).orderBy(desc(analytics.date));
  }

  async getAnalyticsByDate(userId: number, date: string): Promise<Analytics | undefined> {
    const [analytic] = await db.select().from(analytics)
      .where(and(eq(analytics.userId, userId), eq(analytics.date, date)));
    return analytic || undefined;
  }

  async createOrUpdateAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const existing = await this.getAnalyticsByDate(insertAnalytics.userId, insertAnalytics.date);
    
    if (existing) {
      const [updated] = await db
        .update(analytics)
        .set(insertAnalytics)
        .where(eq(analytics.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(analytics)
        .values(insertAnalytics)
        .returning();
      return created;
    }
  }

  async getActivityLogByUserId(userId: number, limit = 10): Promise<ActivityLog[]> {
    return await db.select().from(activityLog)
      .where(eq(activityLog.userId, userId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }

  async createActivityLog(insertActivity: InsertActivityLog): Promise<ActivityLog> {
    const [activity] = await db
      .insert(activityLog)
      .values(insertActivity)
      .returning();
    return activity;
  }
}

export const storage = new DatabaseStorage();
