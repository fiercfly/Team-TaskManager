import { pgTable, text, timestamp, varchar, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "MEMBER"]);
export const statusEnum = pgEnum("status", ["TODO", "IN_PROGRESS", "DONE"]);
export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: roleEnum("role").default("MEMBER").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: statusEnum("status").default("TODO").notNull(),
  priority: priorityEnum("priority").default("MEDIUM").notNull(),
  dueDate: timestamp("due_date"),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
