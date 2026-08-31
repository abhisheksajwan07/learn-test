import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import { testDb } from "../../src/config/database.js";
import { users } from "../../src/db/schema.js";
import { comparePassword, hashPassword } from "../../src/utils/password.js";
import { describe, expect, it } from "vitest";
import config from "../../src/config/env.js";

describe("Auth Module - Integration Tests", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const userData = {
        email: "newuser@example.com",
        name: "New User",
        password: "password123",
      };

      // Act
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      // Assert - HTTP response
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("email");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);

      // Assert - Database state
      const userInDb = await testDb.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, userData.email),
      });

      expect(userInDb).toBeDefined();
      if (!userInDb) {
        throw new Error("User was not created");
      }
      expect(userInDb?.email).toBe(userData.email);
      expect(userInDb?.name).toBe(userData.name);

      // Verify password is hashed
      const isPasswordValid = await comparePassword(
        userData.password,
        userInDb!.passwordHash,
      );

      expect(isPasswordValid).toBe(true);

      expect(userInDb?.passwordHash).not.toBe("password123");
      expect(userInDb?.passwordHash).toBeTruthy();

      // check jwt correctly signed in
      const decoded = jwt.verify(response.body.token, config.jwtSecret) as {
        id: number;
        email: string;
      };

      expect(decoded.id).toBe(userInDb.id);
    });

    it("should return 400 for invalid email format", async () => {
      // Arrange
      const invalidUserData = {
        email: "invalid-email",
        name: "Test User",
        password: "password123",
      };

      // Act & Assert
      await request(app)
        .post("/api/auth/register")
        .send(invalidUserData)
        .expect(400);
    });

    it("should return 409 for duplicate email", async () => {
      // Arrange - Create a user first
      const existingUser = {
        email: "duplicate@example.com",
        name: "Existing User",
        password: "password123",
      };

      await testDb.insert(users).values({
        email: existingUser.email,
        name: existingUser.name,
        passwordHash: await hashPassword(existingUser.password),
      });

      // Act & Assert
      await request(app)
        .post("/api/auth/register")
        .send(existingUser)
        .expect(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Arrange - Create a user
      const userData = {
        email: "loginuser@example.com",
        name: "Login User",
        password: "password123",
      };

      const passwordHash = await hashPassword(userData.password);
      await testDb.insert(users).values({
        email: userData.email,
        name: userData.name,
        passwordHash,
      });

      // Act
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(userData.email);
    });

    it("should return 401 for invalid password", async () => {
      // Arrange - Create a user
      const userData = {
        email: "wrongpass@example.com",
        name: "Wrong Password User",
        password: "correctpassword",
      };

      const passwordHash = await hashPassword(userData.password);
      await testDb.insert(users).values({
        email: userData.email,
        name: userData.name,
        passwordHash,
      });

      // Act & Assert
      await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: "wrongpassword",
        })
        .expect(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return authenticated user data", async () => {
      // Arrange - Create and login a user
      const userData = {
        email: "me@example.com",
        name: "Me User",
        password: "password123",
      };

      const passwordHash = await hashPassword(userData.password);
      const [user] = await testDb
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
          passwordHash,
        })
        .returning();

      // Login to get token
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: userData.email,
        password: userData.password,
      });


      const token = loginResponse.body.token;
    
      
      // Act
      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`auth_token=${token}`])
        .expect(200);

      

      // Assert
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it("should return 401 for unauthenticated request", async () => {
      // Act & Assert
      await request(app).get("/api/auth/me").expect(401);
    });
  });
});
