import { jest } from "@jest/globals";

// In Jest ESM mode, use jest.unstable_mockModule before dynamically importing modules
jest.unstable_mockModule("../src/04_level_label.js", () => ({
  getLevelLabel: jest.fn(),
}));

const { buildStudentSummary } = await import("../src/04_jest_mock.js");
const { getLevelLabel } = await import("../src/04_level_label.js");

// imported mock becomes jest mock at runtime
//Mock the module file so when your function calls getLevelLabel, 
// it calls your fake/mock version instead of the real one.
const mockGetLevelLabel = jest.mocked(getLevelLabel);

describe("buildStudentSummary", () => {
  beforeEach(() => {
    // reset before every test so each test starts clean
    mockGetLevelLabel.mockReset();
  });

  test("uses the mocked imported function and returns the mocked value", () => {
    // here we can decide what values your mocked function will return
    // even though your actual function returns a different value
    mockGetLevelLabel.mockReturnValue("Expert");

    // fn call
    const result = buildStudentSummary("Abhishek", 56);

    // level fn is called one time
    expect(mockGetLevelLabel).toHaveBeenCalledTimes(1);

    // level fn called with value
    expect(mockGetLevelLabel).toHaveBeenCalledWith(56);

    expect(result).toEqual({
      studentName: "Abhishek",
      score: 56,
      level: "Expert",
      message: "Abhishek is currently at Expert level",
    });
  });
});
