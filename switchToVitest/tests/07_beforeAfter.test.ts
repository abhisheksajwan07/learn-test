// before each -> guarentee clean start.
// aftereach=clean exit

import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  addLesson,
  clearLessons,
  getLessonCount,
  getLessons,
} from "../src/07.js";

describe("before each and after each concept", () => {
  // helps to prevent test pollutions
  beforeEach(() => {
    clearLessons();
  });
  afterEach(() => {
    clearLessons();
  });

  test("starts with an empty lessons list in array in every fresh start", () => {
    expect(getLessons()).toEqual([]);
    expect(getLessonCount()).toBe(0);
  });

  test("add one lesson,increases the count", () => {
    addLesson("react");
    expect(getLessons()).toEqual(["react"]);
    expect(getLessonCount()).toBe(1);
  });
  test("add multi lessons", () => {
    addLesson("HTML");
    addLesson("CSS");
    addLesson("JS");
    expect(getLessons()).toEqual(["HTML", "CSS", "JS"]);
    expect(getLessonCount()).toBe(3);
  });
});

// comment both clean up to check what will happen if you don't run the cleanup
