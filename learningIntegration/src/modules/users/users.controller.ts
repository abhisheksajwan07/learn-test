import { Request, Response } from 'express';
import { usersService } from './users.service.js';

class UsersController {
  async getUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id, 10);

    const user = await usersService.getUserById(userId);

    return res.status(200).json(user);
  }
}

export const usersController = new UsersController();
