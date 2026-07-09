import httpStatus from "http-status";
import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IAuthUser } from "../../interfaces/common";
import { MetaService } from "./meta.service";
import sendResponse from "../../shared/sendResponse";

const fetchDashboardMetaData = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IAuthUser);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Metadata retrieval successfully",
      data: result,
    });
  },
);

export const MetaController = {
  fetchDashboardMetaData,
};
