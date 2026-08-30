import { vi } from "vitest";
import { describe, test, expect, beforeEach } from "vitest";

vi.mock("../src/04_level.js", () => ({
  getLevelLabel: vi.fn(),
}));

import { buildStudentSummary } from "../src/04.js";

import { getLevelLabel } from "../src/04_level.js";

const mockedGetLevelLabel = vi.mocked(getLevelLabel);

describe("buildStudentSummary", () => {
  beforeEach(() => {
    // reset before every test so each test starts clean
    mockedGetLevelLabel.mockReset();
  });

  test("uses the mocked imported function and returns the mocked value", () => {
    // here we can decide what values your mocked function will return
    // even though your actual function returns a different value
    mockedGetLevelLabel.mockReturnValue("Expert");

    // fn call
    const result = buildStudentSummary("Abhishek", 56);

    // level fn is called one time
    expect(mockedGetLevelLabel).toHaveBeenCalledTimes(1);

    // level fn called with value
    expect(mockedGetLevelLabel).toHaveBeenCalledWith(56);

    expect(result).toEqual({
      studentName: "Abhishek",
      score: 56,
      level: "Expert",
      message: "Abhishek is currently at Expert level",
    });
  });
});
