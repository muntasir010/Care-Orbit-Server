import httpStatus from "http-status";
import pick from "../../interfaces/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const filter = pick(req.query, doctorFilterableFields);

  const result = await DoctorService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DoctorService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Updated Successfully",
    data: result,
  });
});

const getAISuggestions = catchAsync(async (req, res) => {
  const result = await DoctorService.getAISuggestions(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "AI suggestion fetched successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
  updateIntoDB,
  getAISuggestions,
};
