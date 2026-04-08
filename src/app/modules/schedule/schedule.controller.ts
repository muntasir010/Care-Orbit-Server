import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import type { Request, Response } from "express";
import type { IAuthUser } from "../../interfaces/common";
import pick from "../../interfaces/pick";
import { ScheduleService } from "./schedule.service";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Doctor Schedule created successfully!",
      data: result,
    });
  },
);

const schedulesForDoctor = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const options = pick(req.query, ["startDateTime", "endDateTime"]);

  const result = await ScheduleService.schedulesForDoctor(
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedules Fetch Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const deleteSchedulesFromDB = catchAsync(async (req, res) => {
  const result = await ScheduleService.deleteSchedulesFromDB(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule deleted successfully!",
    data: result,
  });
});

export const ScheduleControllers = {
  insertIntoDB,
  schedulesForDoctor,
  deleteSchedulesFromDB
};
