import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const CreateAdminController = catchAsync(async (req, res) => {
  const result = await UserService.CreateAdmin(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const CreateDoctorController = catchAsync(async (req, res) => {
  const result = await UserService.CreateDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const CreatePatientController = catchAsync(async (req, res) => {
  const result = await UserService.CreatePatient(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

export const UserController = {
  CreatePatientController,
  CreateDoctorController,
  CreateAdminController,
};
