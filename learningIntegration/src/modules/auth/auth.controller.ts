import { Request, Response } from 'express';
import { authService } from './auth.service.js';
import { RegisterRequest, LoginRequest } from './auth.types.js';
import config from '../../config/env.js';
import { validateRequest } from '../../utils/validation.js';
import { AuthenticatedRequest } from '../../middleware/auth.js';

class AuthController {
  async register(req: Request, res: Response) {
    // Validate request
    validateRequest(req);

    const userData: RegisterRequest = req.body;

    const result = await authService.register(userData);

    // Set HTTP-only cookie
    res.cookie(config.cookieName, result.token, {
      httpOnly: config.cookieHttpOnly,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(201).json({
      token: result.token,
      user: result.user,
    });
  }

  async login(req: Request, res: Response) {
    // Validate request
    validateRequest(req);

    const loginData: LoginRequest = req.body;

    const result = await authService.login(loginData);

    // Set HTTP-only cookie
    res.cookie(config.cookieName, result.token, {
      httpOnly: config.cookieHttpOnly,
      secure: config.cookieSecure,
      sameSite: config.cookieSameSite as 'strict' | 'lax' | 'none' | undefined,
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(200).json({
      token: result.token,
      user: result.user,
    });
  }

  async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Authentication required',
        },
      });
    }

    const result = await authService.getMe(req.user.id);

    return res.status(200).json(result);
  }

  async logout(req: Request, res: Response) {
    res.clearCookie(config.cookieName);
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();
