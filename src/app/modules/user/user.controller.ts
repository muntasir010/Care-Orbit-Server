import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../interfaces/pick";
import { userFilterableFields, userOptionAbleFields } from "./user.constants";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async(req, res) =>{
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userOptionAbleFields)
   
  const result = await UserService.getAllUsers( filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data
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
