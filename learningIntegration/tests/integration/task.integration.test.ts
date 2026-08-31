import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { createTestUser } from "../helpers/testFactories";

describe("Task API -Inetgration Testing ", () => {
  describe("POST /api/tasks", () => {
    it("should create a anew task", async () => {
      const user = await createTestUser();
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: user.password,
      });
      const token = loginResponse.body.token;
      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", [`auth_token=${token}`])
        .send({
          title: "Learn integration testing",
          description: "Write the first integration test",
        });

      expect(response.status).toBe(201);

      expect(response.body).toMatchObject({
        title: "Learn integration testing",
        description: "Write the first integration test",
      });

      expect(response.body).toHaveProperty("id");
    });
  });

  describe("Task api-integration testing", () => {
    it("creates a user and protect it from other users", async () => {
      const owner = await createTestUser({
        email: "owner@gmail.com",
        name: "Task Owner",
      });

      const stranger = await createTestUser({
        email: "stranger@gmail.com",
        name: "Another User",
      });

      const ownerLogin = await request(app).post("/api/auth/login").send({
        email: owner.email,
        password: owner.password,
      });

      const strangerLogin = await request(app).post("/api/auth/login").send({
        email: stranger.email,
        password: stranger.password,
      });

      const ownerCookie = ownerLogin.headers["set-cookie"][0]!;
      const strangerCookie = strangerLogin.headers["set-cookie"][0]!;

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", ownerCookie)
        .send({
          title: "Learn integration testing",
          description: "Write the first integration test",
        });

      expect(createResponse.status).toBe(201);

      expect(createResponse.body).toMatchObject({
        title: "Learn integration testing",
        description: "Write the first integration test",
        userId: owner.id,
        completed: false,
      });

      expect(createResponse.body).toHaveProperty("id");

      const taskId = createResponse.body.id;

      await request(app).get(`/api/tasks/${taskId}`).expect(401);

      // valid stranger cookie -> but task doesnt belogn to the stranger

      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", strangerCookie)
        .expect(404);
      // stranger cant update the task
      await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Cookie", strangerCookie)
        .send({
          completed: true,
        })
        .expect(403);

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Cookie", strangerCookie)
        .expect(403);

      const ownerReadResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", ownerCookie)
        .expect(200);

      expect(ownerReadResponse.body.id).toBe(taskId);
    });
  });
});
