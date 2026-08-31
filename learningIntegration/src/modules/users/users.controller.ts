import { Request, Response } from "express";
import { usersService } from "./users.service.js";

type UserParams = {
  id:string
}
class UsersController {
  async getUser(req: Request<UserParams>, res: Response) {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = parseInt(req.params.id, 10);

    const user = await usersService.getUserById(userId);

    return res.status(200).json(user);
  }
}

export const usersController = new UsersController();
