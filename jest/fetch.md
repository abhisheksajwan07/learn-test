
Whenever you need to test fetch, copy this template:



import { jest } from "@jest/globals";
import { yourFunction } from "../src/yourFile.js";

// 1. Create typed mock
const mockFetch = jest.fn<any>();

describe("Testing fetch calls", () => {
  beforeEach(() => {
    // 2. Attach and clean up before each test
    global.fetch = mockFetch;
    mockFetch.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("successful fetch test", async () => {
    // 3. Mock resolved response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: "Sample" }),
    });

    const result = await yourFunction(1);

    expect(result).toBeDefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
