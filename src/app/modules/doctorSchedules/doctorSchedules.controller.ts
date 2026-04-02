import httpStatus from 'http-status';
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse";
import { DoctorSchedulesServices } from './doctorSchedules.service';
import type { Request, Response } from 'express';
import type { IAuthUser } from '../../interfaces/common';

const insertIntoDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const result = await DoctorSchedulesServices.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    });
});

const schedulesForDoctor = catchAsync(async(req, res)=>{
    const result = await DoctorSchedulesServices.schedulesForDoctor();

    sendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Schedules Fetch Successfully!",
        data: result
    })
})


export const DoctorScheduleControllers = {
    insertIntoDB,
    schedulesForDoctor,
}