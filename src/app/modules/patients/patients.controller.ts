import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientsServices } from "./patients.service";
import pick from "../../interfaces/pick";
import { patientFilterableFields } from "./patient.constant";

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PatientsServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const PatientsController = {
  getAllFromDB,
};
