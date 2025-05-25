import { db } from "./db";
import { users, automationCampaigns, analytics, activityLog } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create sample user
  const [user] = await db.insert(users).values({
    username: "john@company.com",
    password: "password",
    email: "john@company.com",
    name: "John Anderson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }).returning();

  console.log("✓ Created user:", user.name);

  // Create sample campaigns
  const campaignData = [
    {
      userId: user.id,
      name: "Sales Outreach Campaign",
      type: "connection",
      status: "active",
      settings: { dailyLimit: 25, targetRole: "Software Engineer" }
    },
    {
      userId: user.id,
      name: "Content Engagement",
      type: "engagement", 
      status: "scheduled",
      settings: { likesPerDay: 50, commentsPerDay: 12 }
    },
    {
      userId: user.id,
      name: "Follow-up Messages",
      type: "message",
      status: "paused", 
      settings: { messageTemplate: "Thanks for connecting!" }
    }
  ];

  const campaigns = await db.insert(automationCampaigns).values(campaignData).returning();
  console.log("✓ Created campaigns:", campaigns.length);

  // Create sample analytics for the last 7 days
  const today = new Date();
  const analyticsData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    analyticsData.push({
      userId: user.id,
      date: dateStr,
      connectionsSent: Math.floor(Math.random() * 20) + 30,
      connectionsAccepted: Math.floor(Math.random() * 10) + 8,
      messagesSeent: Math.floor(Math.random() * 15) + 10,
      contentShared: Math.floor(Math.random() * 3) + 1,
      likesGiven: Math.floor(Math.random() * 30) + 40,
      commentsGiven: Math.floor(Math.random() * 8) + 5
    });
  }

  await db.insert(analytics).values(analyticsData);
  console.log("✓ Created analytics data for 7 days");

  // Create sample activity logs
  const activitiesData = [
    {
      userId: user.id,
      type: "connection_accepted",
      title: "Connection request accepted",
      description: "Sarah Johnson (Marketing Director at TechCorp) accepted your connection request",
      status: "success"
    },
    {
      userId: user.id,
      type: "batch_connections",
      title: "Batch connection requests sent",
      description: "25 connection requests sent to Software Engineers in San Francisco",
      status: "completed"
    },
    {
      userId: user.id,
      type: "content_shared",
      title: "Content shared successfully", 
      description: '"5 Tips for Better LinkedIn Networking" post shared to your timeline',
      status: "posted"
    },
    {
      userId: user.id,
      type: "engagement_completed",
      title: "Engagement automation completed",
      description: "Liked 50 posts and commented on 12 posts from your network",
      status: "engaged"
    }
  ];

  await db.insert(activityLog).values(activitiesData);
  console.log("✓ Created activity log entries");

  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});