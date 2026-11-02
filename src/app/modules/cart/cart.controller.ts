import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CartService } from "./cart.service";

const getMyCart = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await CartService.getMyCart(req.user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart fetched successfully",
      data: result,
    });
  },
);

const addToCart = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await CartService.addToCart(req.user, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Medicine added to cart successfully",
      data: result,
    });
  },
);

const updateCartItem = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await CartService.updateCartItem(
      req.user,
      req.params.id as string,
      req.body.quantity,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart item updated successfully",
      data: result,
    });
  },
);

const removeCartItem = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await CartService.removeCartItem(
      req.user,
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart item removed successfully",
      data: result,
    });
  },
);

export const CartController = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
