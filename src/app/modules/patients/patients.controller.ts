import type { Request, Response } from 'express';
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PatientsServices } from "./patients.service";
import pick from "../../interfaces/pick";
import { patientFilterableFields } from "./patient.constant";
import type { IAuthUser } from '../../interfaces/common';

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

const getByIdFromDB = catchAsync(async (req, res) => {

  const { id } = req.params;
  const result = await PatientsServices.getByIdFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient retrieval successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req:Request &{user?: IAuthUser}, res:Response) => {
  const user = req.user;
  const result = await PatientsServices.updateIntoDB(user as IAuthUser, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient updated successfully',
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PatientsServices.softDelete(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Patient soft deleted successfully',
    data: result,
  });
});

export const PatientsController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  softDelete,
};
