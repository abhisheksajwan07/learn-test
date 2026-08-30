import { db } from "../../config/database.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { ConflictError, NotFoundError } from "../../errors/HttpError.js";
import { RegisterRequest } from "./auth.types.js";

class AuthRepository {
  async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findUserById(id: number) {
    return db.query.users.findFirst({
      where: eq(users.id, id),
    });
  }

  async createUser(userData: RegisterRequest & { passwordHash: string }) {
    try {
      const [user] = await db.insert(users).values(userData).returning();
      return user;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new ConflictError("Email already in use");
      }
      throw error;
    }
  }
}

export const authRepository = new AuthRepository();
