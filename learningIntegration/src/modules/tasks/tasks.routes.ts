import { Router } from 'express';
import { body, param } from 'express-validator';
import { tasksController } from './tasks.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Create task
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
  ],
  tasksController.createTask.bind(tasksController)
);

// Get all tasks
router.get('/', authenticate, tasksController.getAllTasks.bind(tasksController));

// Get task by ID
router.get(
  '/:id',
  authenticate,
  [param('id').isInt().withMessage('Task ID must be an integer')],
  tasksController.getTask.bind(tasksController)
);

// Update task
router.patch(
  '/:id',
  authenticate,
  [
    param('id').isInt().withMessage('Task ID must be an integer'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  ],
  tasksController.updateTask.bind(tasksController)
);

// Delete task
router.delete(
  '/:id',
  authenticate,
  [param('id').isInt().withMessage('Task ID must be an integer')],
  tasksController.deleteTask.bind(tasksController)
);

export default router;
