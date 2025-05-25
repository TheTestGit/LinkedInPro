import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
});

// Automation campaigns
export const automationCampaigns = pgTable("automation_campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'connection', 'content', 'engagement'
  status: text("status").notNull().default('active'), // 'active', 'paused', 'completed'
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Automation tasks/activities
export const automationTasks = pgTable("automation_tasks", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  type: text("type").notNull(), // 'connection_request', 'message', 'like', 'comment', 'post'
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  targetProfile: text("target_profile"),
  content: text("content"),
  result: text("result"), // 'accepted', 'declined', 'pending'
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  connectionsSent: integer("connections_sent").default(0),
  connectionsAccepted: integer("connections_accepted").default(0),
  messagesSeent: integer("messages_sent").default(0),
  contentShared: integer("content_shared").default(0),
  likesGiven: integer("likes_given").default(0),
  commentsGiven: integer("comments_given").default(0),
});

// Activity log
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'connection_accepted', 'content_shared', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // 'success', 'completed', 'posted', 'engaged'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCampaignSchema = createInsertSchema(automationCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(automationTasks).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type AutomationCampaign = typeof automationCampaigns.$inferSelect;
export type InsertAutomationCampaign = z.infer<typeof insertCampaignSchema>;

export type AutomationTask = typeof automationTasks.$inferSelect;
export type InsertAutomationTask = z.infer<typeof insertTaskSchema>;

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
