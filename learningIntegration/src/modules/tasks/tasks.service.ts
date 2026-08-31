import { tasksRepository } from './tasks.repository.js';
import { CreateTaskRequest, UpdateTaskRequest, Task } from './tasks.types.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

export class TasksService {
  async createTask(taskData: CreateTaskRequest, userId: number): Promise<Task> {
    const task = await tasksRepository.createTask({
      title: taskData.title,
      description: taskData.description || null,
      userId,
    });

    return this.formatTask(task);
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await tasksRepository.findTaskByIdForUser(id, userId);
    return this.formatTask(task);
  }

  async getAllTasks(userId: number): Promise<Task[]> {
    const tasks = await tasksRepository.findTasksByUserId(userId);
    return tasks.map(this.formatTask);
  }

  async updateTask(
    id: number,
    updates: UpdateTaskRequest,
    userId: number
  ): Promise<Task> {
    const task = await tasksRepository.updateTask(id, updates, userId);
    return this.formatTask(task);
  }

  async deleteTask(id: number, userId: number): Promise<void> {
    await tasksRepository.deleteTask(id, userId);
  }

  private formatTask(task: any): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      userId: task.userId,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}

export const tasksService = new TasksService();
