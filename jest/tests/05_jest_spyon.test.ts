// jest.mock ->replace the depedency entirely
// jest.spyon -> will strt by observig a real method
// create a spy on that particular method

import { expect, jest, test } from "@jest/globals";
import { buildPriceSummary, priceUtils } from "../src/05_jest_spyon.js";

describe("buildPriceSummary", () => {
  test("calls the real helper and still lets us inspect the calls", () => {
    // 2nd argument shuld be the name of the method inside the object
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");
    //spyOn tracks because then we can track that this method ran 3 times or not

    const result = buildPriceSummary("Node", 500, 50);
    expect(formatCurrencySpy).toHaveBeenCalledTimes(3);
    expect(formatCurrencySpy).toHaveBeenNthCalledWith(1, 500);
    expect(formatCurrencySpy).toHaveBeenNthCalledWith(2, 450);
    expect(formatCurrencySpy).toHaveBeenNthCalledWith(3, 50);
    expect(result).toEqual({
      courseTitle: "Node",
      originalPriceLabel: 500,
      finalPriceLabel: 450,
      savedAmountLabel: 50,
      message: `Buy Node for 450 and save 50`,
    });

    formatCurrencySpy.mockRestore();
  });

  test("dont  call the helper when the function throws early  a -ve value ", () => {
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");

    expect(() => buildPriceSummary("React", 100, -50)).toThrow(
      "Discount amount cannot be negative",
    );
    expect(formatCurrencySpy).not.toHaveBeenCalled();
    formatCurrencySpy.mockRestore();
  });

  test("don't call the helper when the function throws early for a -ve finalprice", () => {
    const formatCurrencySpy = jest.spyOn(priceUtils, "formatCurrency");
    // for sync call use this patern
    expect(() => buildPriceSummary("React", 100, 101)).toThrow(
      " Final price cannot be negative",
    );
    expect(formatCurrencySpy).not.toHaveBeenCalled();
    formatCurrencySpy.mockRestore();
  });
});
