import httpStatus from "http-status";
import pick from "../../interfaces/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { doctorFilterableFields } from "./doctor.constant";

const getAllFromDB = catchAsync(async (req, res) => {
  const options = pick(req.query, [
    "page",
    "skip",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filter = pick(req.query, doctorFilterableFields);

  const result = DoctorService.getAllFromDB(filter, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor fetched successfully",
    data: result,
  });
});

export const DoctorController = {
  getAllFromDB,
};
