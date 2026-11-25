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

const getRiderById = catchAsync(async (req, res) => {
  const result = await RiderService.getRiderById(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider retrieved successfully",
    data: result,
  });
});

const updateRider = catchAsync(async (req, res) => {
  const result = await RiderService.updateRider(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider updated successfully",
    data: result,
  });
});

const updateRiderAvailability = catchAsync(async (req, res) => {
  const result = await RiderService.updateRiderAvailability(
    req.params.id as string,
    req.body.isAvailable,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rider availability updated successfully",
    data: result,
  });
});

export const RiderController = {
  getAllRiders,
  getRiderById,
  updateRider,
  updateRiderAvailability,
};