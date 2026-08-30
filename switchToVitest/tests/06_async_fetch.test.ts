import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fetchCourseTitle } from "../src/06.js";

// Create a typed mock function for fetch
const mockFetch = vi.fn<typeof fetch>();

describe("external api call", () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });


  test("returns the course title when the api call successful", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Node JS testing full course",
      }),
    } as Response);

    const result = await fetchCourseTitle(1);
    expect(result).toBe("Node JS testing full course");

    // check whether fetch has been called only once?
    expect(mockFetch).toHaveBeenCalledTimes(1);
    // fetch called with correct url?
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com/courses/1");
  });

  test("rejects with an error when the API returns non ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({
        message: "Not found",
      }),
    } as Response);

    await expect(fetchCourseTitle(20)).rejects.toThrow(
      "Failed to fetch course",
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/courses/20",
    );
  });

  // mockRejectedValueOnce → fake rejected Promise
  test("rejects if netwrok related issue", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchCourseTitle(11)).rejects.toThrow("Network Error");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/courses/11",
    );
  });

  test("throws invalid error immediately for an invalid courseId", async () => {
    await expect(fetchCourseTitle(0)).rejects.toThrow(
      "courseId must be greater than 0",
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
