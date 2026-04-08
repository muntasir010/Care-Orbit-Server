import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import type { Request, Response } from "express";
import type { IJWTPayload } from "../../types/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user as IJWTPayload, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Doctor Schedule Created Successfully.",
      data: result,
    });
  },
);

export const DoctorController = {
  insertIntoDB,
};
