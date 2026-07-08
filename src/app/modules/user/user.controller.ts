import httpStatus from 'http-status';
import type { IAuthUser } from "../../interfaces/common";
import pick from "../../interfaces/pick";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields, userOptionAbleFields } from "./user.constants";
import { UserService } from "./user.service";
import type { Request, Response } from "express";

const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, userOptionAbleFields);

  const result = await UserService.getAllUsers(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

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

const CreatePatient = catchAsync(async (req, res) => {
  const result = await UserService.CreatePatient(req);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await UserService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  },
);

const changeProfileStatus = catchAsync(async(req, res)=> {
  const {id} = req.params;
  const result = await UserService.changeProfileStatus(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile status updated successfully",
    data: result,
  })
})

export const UserController = {
  getAllUsers,
  CreatePatient,
  CreateDoctor,
  CreateAdmin,
  getMyProfile,
  changeProfileStatus,
};
