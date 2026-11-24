import httpStatus from 'http-status';
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { RiderService } from "./rider.service";

const getAllRiders = catchAsync(async (req, res) => {
  const result = await RiderService.getAllRiders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Riders retrieved successfully",
    data: result,
  });
});

export const RiderController = {
  getAllRiders,
};