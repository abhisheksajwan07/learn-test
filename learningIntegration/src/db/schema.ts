import {
  serial,
  integer,
  text,
  timestamp,
  boolean,
  pgSchema,
} from "drizzle-orm/pg-core";

// Create a schema for our application to avoid naming conflicts
const auth = pgSchema("auth");
const app = pgSchema("app");

// User schema
const users = app.table("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Task schema
const tasks = app.table("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  userId: integer("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export { users, tasks };
