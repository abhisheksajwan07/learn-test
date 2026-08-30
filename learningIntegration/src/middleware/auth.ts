import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { UnauthorizedError } from '../errors/HttpError.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[config.cookieName];

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: number; email: string };

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    throw error;
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[config.cookieName];

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: number; email: string };
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };
      } catch (error) {
        // Invalid token, but we'll proceed without authentication
      }
    }

    next();
  } catch (error) {
    next();
  }
};
