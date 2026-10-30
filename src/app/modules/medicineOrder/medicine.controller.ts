import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { fileUploader } from "../../helper/fileUploader";
import { MedicineOrderService } from "./medicineOrder.service";
import sendResponse from "../../shared/sendResponse";
import {
  orderFilterableFields,
  orderPaginationFields,
} from "./medicineOrder.constant";
import pick from "../../interfaces/pick";

// Create Order (Patient)
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

// Get My Orders (Patient)
const getMyOrders = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const filters = pick(req.query, orderFilterableFields as any);
    const options = pick(req.query, orderPaginationFields as any);

    const result = await MedicineOrderService.getMyOrders(
      req.user,
      filters,
      options,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My orders fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

// Get All Orders (Admin)
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields as any);
  const options = pick(req.query, orderPaginationFields as any);

  const result = await MedicineOrderService.getAllOrders(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All orders fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getOrderById = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await MedicineOrderService.getOrderById(
      req.user,
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order fetched successfully",
      data: result,
    });
  },
);

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await MedicineOrderService.updateOrderStatus(
    req.params.id as string,
    req.body.status,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

// Cancel My Order (Patient)
const cancelMyOrder = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await MedicineOrderService.cancelMyOrder(
      req.user,
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Order cancelled successfully",
      data: result,
    });
  },
);

export const MedicineOrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder,
};
