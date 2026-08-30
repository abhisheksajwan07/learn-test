import { testDb } from "../../src/config/database.js";
import { users, tasks } from "../../src/db/schema.js";
import { hashPassword } from "../../src/utils/password.js";
import { RegisterRequest } from "../../src/modules/auth/auth.types.js";

// User factory
export const createTestUser = async (overrides?: Partial<RegisterRequest>) => {
  const defaultUser = {
    email: `user_${Date.now()}@test.com`,
    name: "Test User",
    password: "password123",
  };

  const userData = { ...defaultUser, ...overrides };
  const passwordHash = await hashPassword(userData.password);

  const [user] = await testDb
    .insert(users)
    .values({
      email: userData.email,
      name: userData.name,
      passwordHash,
    })
    .returning();

  return {
    ...user,
    password: userData.password, // Include password for login
  };
};

// Task factory
export const createTestTask = async (overrides?: {
  title?: string;
  description?: string;
  completed?: boolean;
  userId?: number;
}) => {
  const defaultTask = {
    title: "Test Task",
    description: "This is a test task",
    completed: false,
    userId: 1, // Default user ID
  };

  const taskData = { ...defaultTask, ...overrides };

  const [task] = await testDb.insert(tasks).values(taskData).returning();

  return task;
};

// Login helper
export const loginTestUser = async (email: string, password: string) => {
  // This would normally call the login endpoint
  // For factory purposes, we'll just return the user data
  const user = await testDb.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  return user;
};
