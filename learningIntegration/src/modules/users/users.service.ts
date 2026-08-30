import { usersRepository } from './users.repository.js';
import { UserResponse } from './users.types.js';

class UsersService {
  async getUserById(id: number): Promise<UserResponse> {
    const user = await usersRepository.findUserById(id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const usersService = new UsersService();
