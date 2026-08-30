import { db } from '../../config/database.js';
import { tasks, users } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { NotFoundError, ForbiddenError } from '../../errors/HttpError.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

class TasksRepository {
  async createTask(taskData: {
    title: string;
    description: string | null;
    userId: number;
  }) {
    const [task] = await db
      .insert(tasks)
      .values(taskData)
      .returning();

    return task;
  }

  async findTaskById(id: number) {
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  async findTasksByUserId(userId: number) {
    return db.query.tasks.findMany({
      where: eq(tasks.userId, userId),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });
  }

  async updateTask(
    id: number,
    updates: { title?: string; description?: string; completed?: boolean },
    userId: number
  ) {
    // First verify the task exists and belongs to the user
    const existingTask = await this.findTaskById(id);

    if (existingTask.userId !== userId) {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    return updatedTask;
  }

  async deleteTask(id: number, userId: number) {
    // First verify the task exists and belongs to the user
    const existingTask = await this.findTaskById(id);

    if (existingTask.userId !== userId) {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async findTaskByIdForUser(id: number, userId: number) {
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }
}

export const tasksRepository = new TasksRepository();
