import { beforeEach, describe, expect, it, vi } from "vitest";
import { tasksRepository } from "../../src/modules/tasks/tasks.repository.js";
import { tasksService } from "../../src/modules/tasks/tasks.service.js";
import { ForbiddenError, NotFoundError } from "../../src/errors/HttpError.js";

vi.mock("../../src/modules/tasks/tasks.repository.js");

describe("TasksService", () => {
  const dbTask = {
    id: 1,
    title: "learn vitest",
    description: "write tests",
    completed: false,
    userId: 11,
    createdAt: new Date("2026-08-31T10:00:00Z"),
    updatedAt: new Date("2026-08-31T10:00:00Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task with description", async () => {
      vi.mocked(tasksRepository.createTask).mockResolvedValue(dbTask);

      const result = await tasksService.createTask(
        { title: dbTask.title, description: dbTask.description },
        dbTask.userId,
      );

      expect(tasksRepository.createTask).toHaveBeenCalledWith({
        title: "learn vitest",
        description: "write tests",
        userId: 11,
      });

      expect(result).toMatchObject({
        id: 1,
        title: "learn vitest",
        completed: false,
        userId: 11,
        createdAt: "2026-08-31T10:00:00.000Z",
        updatedAt: "2026-08-31T10:00:00.000Z",
      });
    });

    it("should create a task without description — converts to null", async () => {
      vi.mocked(tasksRepository.createTask).mockResolvedValue({
        ...dbTask,
        description: null,
      });

      const result = await tasksService.createTask(
        { title: dbTask.title },
        dbTask.userId,
      );

      expect(tasksRepository.createTask).toHaveBeenCalledWith({
        title: "learn vitest",
        description: null,
        userId: 11,
      });

      expect(result.description).toBeNull();
      expect(result.createdAt).toBe("2026-08-31T10:00:00.000Z");
    });
  });

  describe("getTaskById", () => {
    it("should return formatted task for correct user", async () => {
      vi.mocked(tasksRepository.findTaskByIdForUser).mockResolvedValue(dbTask);

      const result = await tasksService.getTaskById(1, 11);

      expect(tasksRepository.findTaskByIdForUser).toHaveBeenCalledWith(1, 11);
      expect(result).toMatchObject({
        id: 1,
        title: "learn vitest",
        userId: 11,
        createdAt: "2026-08-31T10:00:00.000Z",
      });
    });

    it("should throw NotFoundError when task not found", async () => {
      vi.mocked(tasksRepository.findTaskByIdForUser).mockRejectedValue(
        new NotFoundError("Task not found"),
      );

      await expect(tasksService.getTaskById(5, 10)).rejects.toThrow(
        "Task not found",
      );
    });
  });

  describe("deleteTask", () => {
    it("should call repository deleteTask with correct args", async () => {
      vi.mocked(tasksRepository.deleteTask).mockResolvedValue(undefined);

      await tasksService.deleteTask(1, 11);

      expect(tasksRepository.deleteTask).toHaveBeenCalledWith(1, 11);
    });

    it("userId doesn't belongs to the task ", async () => {
      vi.mocked(tasksRepository.deleteTask).mockRejectedValue(
        new ForbiddenError("You do not have permission to delete this task"),
      );
      await expect(tasksService.deleteTask(1, 11)).rejects.toThrow();
    });
  });

  describe("updateTask", () => {
    it("should update a task and return the formatted task", async () => {
      const updatedTask = {
        ...dbTask,
        title: "unit-test",
        description: "learning unit test",
        completed: true,
        userId: 19,
      };
      vi.mocked(tasksRepository.updateTask).mockResolvedValue(updatedTask);

      const result = await tasksService.updateTask(
        1,
        {
          title: "unit-test",
          description: "learning unit test",
          completed: true,
        },
        12,
      );

      expect(tasksRepository.updateTask).toHaveBeenCalledWith(
        1,
        {
          title: "unit-test",
          description: "learning unit test",
          completed: true,
        },
        12,
      );
      expect(result).toMatchObject({
        id: 1,
        title: "unit-test",
        description: "learning unit test",
        completed: true,
        userId: 19,
      });
    });

    it("should propagate repository errors", async () => {
      vi.mocked(tasksRepository.updateTask).mockRejectedValue(
        new ForbiddenError("You do not have permission to update this task"),
      );

      await expect(
        tasksService.updateTask(1, { title: "unit-test" }, 12),
      ).rejects.toThrow("You do not have permission to update this task");
    });
  });
});
