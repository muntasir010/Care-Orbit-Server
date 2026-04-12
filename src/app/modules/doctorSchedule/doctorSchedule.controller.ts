import httpStatus from "http-status";
import { DoctorScheduleService } from "./doctorSchedule.service";
import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IAuthUser } from "../../interfaces/common";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user as IAuthUser, req.body);

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
