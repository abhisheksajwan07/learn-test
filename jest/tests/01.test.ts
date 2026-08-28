import {
  getCourseAccessMessage,
  getEnrollmentMessage,
} from "../src/01_first_test.js";

describe("getEnrollmentMessage", () => {
  test("returns more than 1 seat when counter > 1", () => {
    const result = getEnrollmentMessage(12);
    expect(result).toBe("12 seats left");
  });
});

describe("getCourseAccessMessage", () => {
  test("return 'Payment required' if the user is a paid user", () => {
    const result = getCourseAccessMessage(false);
    expect(result).toBe("Payment Required");
  });
});
