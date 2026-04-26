import httpStatus from 'http-status';
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientsServices } from './patients.service';

const getAllFromDB = catchAsync(async (req, res) => {

  const result = await PatientsServices.getAllFromDB({}, {});

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: result
  });
});

export const PatientsController = {
    getAllFromDB
}