import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async(req, res) =>{
  const {page, limit} = req.query;
  const result = await UserService.getAllUsers({page: Number(page), limit: Number(limit)});
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
})

const CreateAdmin = catchAsync(async (req, res) => {
  const result = await UserService.CreateAdmin(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const CreateDoctor = catchAsync(async (req, res) => {
  const result = await UserService.CreateDoctor(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const CreatePatient= catchAsync(async (req, res) => {
  const result = await UserService.CreatePatient(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  CreatePatient,
  CreateDoctor,
  CreateAdmin,
};
