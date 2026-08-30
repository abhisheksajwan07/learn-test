import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Get user by ID
router.get('/:id', authenticate, usersController.getUser.bind(usersController));

export default router;
