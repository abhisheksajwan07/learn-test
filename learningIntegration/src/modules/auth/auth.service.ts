import jwt from 'jsonwebtoken';
import config from '../../config/env.js';
import { authRepository } from './auth.repository.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { RegisterRequest, LoginRequest } from './auth.types.js';
import { ConflictError, UnauthorizedError } from '../../errors/HttpError.js';

class AuthService {
  async register(userData: RegisterRequest) {
    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const user = await authRepository.createUser({
      ...userData,
      passwordHash,
    });

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginData: LoginRequest) {
    // Find user by email
    const user = await authRepository.findUserByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(
      loginData.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getMe(userId: number) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  private generateToken(userId: number, email: string): string {
    return jwt.sign(
      { id: userId, email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }
}

export const authService = new AuthService();
