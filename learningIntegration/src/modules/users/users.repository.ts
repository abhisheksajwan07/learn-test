import { db } from '../../config/database.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../errors/HttpError.js';

class UsersRepository {
  async findUserById(id: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}

export const usersRepository = new UsersRepository();
