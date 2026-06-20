import httpStatus from "http-status";
import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IAuthUser } from "../../interfaces/common";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(
      user as IAuthUser,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  },
);

export const AppointmentController = {
  createAppointment,
};
