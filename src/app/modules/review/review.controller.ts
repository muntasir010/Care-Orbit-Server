import httpStatus from "http-status";
import type { Request, Response } from "express";
import type { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user as IAuthUser, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review inserted successfully",
      data: result,
    });
  },
);

export const ReviewController = {
  insertIntoDB,
};
