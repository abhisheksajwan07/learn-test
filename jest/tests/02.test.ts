import {
  buildCourseMeta,
  getCoursePriceLabel,
} from "../src/02_matcher_edge_case.js";


/*
expect creates an xpressions and after it is the MATCHERS method
*/
describe("getCoursePriceLabel", () => {
  test("returns 'free' when the price is 0", () => {
    const result = getCoursePriceLabel(0);
    expect(result).toBe("Free");
  });

  // when price is negative
  test("returns 'invalid price' when the price is -ve", () => {
    const result = getCoursePriceLabel(-100);
    expect(result).toBe("Invalid Price");
  });

  // null
  test("returns null if the price input is null", () => {
    const result = getCoursePriceLabel(null);

    expect(result).toBeNull();
  });
});

describe("buildCourseMeta", () => {
  test("returns the full object fro valid inputs", () => {
    const res = buildCourseMeta("Node Testing", ["Intro", "Mocks"]);

    expect(res).toEqual({
      title: "Node Testing",
      lessons: ["Intro", "Mocks"],
      totalLessons: 2,
      firstLesson: "Intro",
      hasLessons: true,
      errors: [],
    });
  });

  // if u want to check a particular item
  test("stores all lessons and let us check array contains particular item", () => {
    const res = buildCourseMeta("kaka", ["React", "Next"]);
    // i want to check a whether input contains a particular item
    expect(res.lessons).toContain("Next js");
  });

  test("check array size", () => {
    const res = buildCourseMeta("kaka", ["React", "Next"]);
    expect(res.lessons).toHaveLength(2);
    expect(res.errors).toHaveLength(0);
  });

  test("returns 'haslesson as true' when lesson exists", () => {
    const res = buildCourseMeta("kaka", ["React", "next js"]);
    expect(res.hasLessons).toBe(true);
  });

  test("sets firstLesson as undefined when the lessons array is empty", () => {
    const res = buildCourseMeta("kaka", []);
    expect(res.firstLesson).toBeUndefined();
  });

  // if lesson = null
  test("adds an error and empty lessons array when lessons are null", () => {
    const res = buildCourseMeta("Testing", null);
    expect(res.lessons).toEqual([]);
    expect(res.totalLessons).toBe(0);
    expect(res.firstLesson).toBeUndefined(); // since your fucnitons converts it to an empty array so it wot be null but []
    expect(res.errors).toContain("lessons are required");
  });

  test("does not include a lesson that was never provided", () => {
    const res = buildCourseMeta("Unit Testing", ["JEST", "RTL"]);
    // it should not contain VITEST -> it is true because expected value shouldn't be VITEST
    // and in input , we haven't given it
    expect(res.lessons).not.toContain("VITEST");
  });
});
