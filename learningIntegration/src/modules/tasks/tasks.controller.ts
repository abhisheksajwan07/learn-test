import { Request, Response } from 'express';
import { tasksService } from './tasks.service.js';
import { CreateTaskRequest, UpdateTaskRequest, TaskParams } from './tasks.types.js';
import { validateRequest } from '../../utils/validation.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

class TasksController {
  async createTask(req: AuthenticatedRequest, res: Response) {
    // Validate request
    validateRequest(req);

    const taskData: CreateTaskRequest = req.body;
    const userId = req.user!.id;

    const task = await tasksService.createTask(taskData, userId);

    return res.status(201).json(task);
  }

  async getTask(req: AuthenticatedRequest & Request<TaskParams>, res: Response) {
    const params = req.params;
    const taskId = parseInt(params.id);
    const userId = req.user!.id;

    const task = await tasksService.getTaskById(taskId, userId);

    return res.status(200).json(task);
  }

  async getAllTasks(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;

    const tasks = await tasksService.getAllTasks(userId);

    return res.status(200).json(tasks);
  }

  async updateTask(req: AuthenticatedRequest & Request<TaskParams>, res: Response) {
    // Validate request
    validateRequest(req);

    const params = req.params;
    const taskId = parseInt(params.id);
    const updates: UpdateTaskRequest = req.body;
    const userId = req.user!.id;

    const task = await tasksService.updateTask(taskId, updates, userId);

    return res.status(200).json(task);
  }

  async deleteTask(req: AuthenticatedRequest & Request<TaskParams>, res: Response) {
    const params = req.params;
    const taskId = parseInt(params.id);
    const userId = req.user!.id;

    await tasksService.deleteTask(taskId, userId);

    return res.status(204).send();
  }
}

export const tasksController = new TasksController();
