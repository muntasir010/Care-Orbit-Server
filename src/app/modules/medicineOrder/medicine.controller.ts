import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { fileUploader } from "../../helper/fileUploader";
import { MedicineOrderService } from "./medicineOrder.service";
import sendResponse from "../../shared/sendResponse";

// const getUser = (req: Request) =>
//   (req as any).user as Parameters<typeof MedicineOrderService.createOrder>[0];

const createOrder = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    if (req.file)
      req.body.prescriptionUrl = await fileUploader.uploadToCloudinary(
        req.file,
      );
      
    const result = await MedicineOrderService.createOrder(req.user, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Order placed successfully",
      data: result,
    });
  },
);

export const MedicineOrderController = {
  createOrder,
};
