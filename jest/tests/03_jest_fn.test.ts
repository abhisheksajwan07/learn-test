import { jest } from "@jest/globals";

import {
  type CreateGatewayRefund,
  processRefundRequest,
} from "../src/03_jest_function.js";

// jest.fn helps in creating mock function
// bascially a fake fn whihc jest creates for u
// so u can control it and can see how it is used
// like calling an external email service during signup

describe("processRefundRequest", () => {
  test("call payment gateway dependency with the correct payment id,amount & reason", () => {
    const createGatewayRefundMock = jest
      .fn<CreateGatewayRefund>()
      .mockReturnValue({
        ok: true,
        refundId: "rf-123",
      });

    const result = processRefundRequest(
      "order_001",
      "payment_9231",
      333,
      3,
      createGatewayRefundMock,
    );

    expect(createGatewayRefundMock).toHaveBeenCalledTimes(1);
    expect(createGatewayRefundMock).toHaveBeenCalledWith(
      "payment_9231",
      333,
      "Customer refund for order order_001",
    );

    expect(result).toEqual({
      status: "approved",
      message: "Refund processed successfully",
      refundId: "rf-123",
      refundedAmount: 333,
    });
  });

  test("does not call the payment when the refund window is already closed", () => {
    const createGatewayRefundMock = jest
      .fn<CreateGatewayRefund>()
      .mockReturnValue({
        ok: true,
        refundId: "rf-123",
      });

    const res = processRefundRequest(
      "order-001",
      "pay_21",
      2312,
      23,
      createGatewayRefundMock,
    );
    expect(createGatewayRefundMock).not.toHaveBeenCalled();
    expect(res).toEqual({
      status: "rejected",
      message: "Refund window closed",
      refundId: null,
      refundedAmount: 0,
    });
  });

  /**
   * doesn't call payment gateway when the refund amt is invalid
   */
  test("return when the gateway dependency report that refund creation failed", () => {
    const createGatewayRefundMock = jest
      .fn<CreateGatewayRefund>()
      .mockReturnValue({
        ok: false,
        refundId: null,
      });

    const res = processRefundRequest(
      "order-1234",
      "pay_fail-12",
      9897,
      1,
      createGatewayRefundMock,
    );

    expect(createGatewayRefundMock).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      status: "failed",
      message: "Gateway refund failed",
      refundId: null,
      refundedAmount: 0,
    });
  });
});
