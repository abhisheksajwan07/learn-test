import { testDb } from "../../src/config/database.js";
import { users, tasks } from "../../src/db/schema.js";
import { hashPassword } from "../../src/utils/password.js";
import { RegisterRequest } from "../../src/modules/auth/auth.types.js";

export const createTestUser = async (
  overrides?: Partial<RegisterRequest>,
) => {
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
    password: userData.password,
  };
};

export const createTestTask = async (userId: number, overrides?: {
  title?: string;
  description?: string | null;
  completed?: boolean;
}) => {
  const defaultTask = {
    title: "Test Task",
    description: "This is a test task",
    completed: false,
    userId,
  };

  const taskData = {
    ...defaultTask,
    ...overrides,
  };

  const [task] = await testDb
    .insert(tasks)
    .values(taskData)
    .returning();

  return task;
};