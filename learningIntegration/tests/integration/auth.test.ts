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
      const userData = {
        email: "newuser@example.com",
        name: "New User",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);

      const userInDb = await testDb.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, userData.email),
      });

      expect(userInDb).toBeDefined();
      if (!userInDb) throw new Error("User was not created");

      expect(userInDb.email).toBe(userData.email);
      expect(userInDb.name).toBe(userData.name);

      const isPasswordValid = await comparePassword(
        userData.password,
        userInDb.passwordHash,
      );
      expect(isPasswordValid).toBe(true);
      expect(userInDb.passwordHash).not.toBe("password123");

      const decoded = jwt.verify(response.body.token, config.jwtSecret) as {
        id: number;
        email: string;
      };
      expect(decoded.id).toBe(userInDb.id);
    });

    it("should return 400 for invalid email format", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ email: "invalid-email", name: "Test User", password: "password123" })
        .expect(422);  
    });

    it("should return 409 for duplicate email", async () => {
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

      await request(app)
        .post("/api/auth/register")
        .send(existingUser)
        .expect(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const userData = {
        email: "loginuser@example.com",
        name: "Login User",
        password: "password123",
      };

      await testDb.insert(users).values({
        email: userData.email,
        name: userData.name,
        passwordHash: await hashPassword(userData.password),
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: userData.password })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe(userData.email);
    });

    it("should return 401 for invalid password", async () => {
      const userData = {
        email: "wrongpass@example.com",
        name: "Wrong Password User",
        password: "correctpassword",
      };

      await testDb.insert(users).values({
        email: userData.email,
        name: userData.name,
        passwordHash: await hashPassword(userData.password),
      });

      await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: "wrongpassword" })
        .expect(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return authenticated user data", async () => {
      const userData = {
        email: "me@example.com",
        name: "Me User",
        password: "password123",
      };

      await testDb.insert(users).values({
        email: userData.email,
        name: userData.name,
        passwordHash: await hashPassword(userData.password),
      });

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: userData.email, password: userData.password });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/api/auth/me")
        .set("Cookie", [`auth_token=${token}`])
        .expect(200);

      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
    });

    it("should return 401 for unauthenticated request", async () => {
      await request(app).get("/api/auth/me").expect(401);
    });
  });
});