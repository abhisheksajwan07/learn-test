import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Register route
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  ],
  authController.register.bind(authController)
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login.bind(authController)
);

// Get current user (me)
router.get('/me', authenticate, authController.me.bind(authController));

// Logout route
router.post('/logout', authController.logout.bind(authController));

export default router;
