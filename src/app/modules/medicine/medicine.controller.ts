
import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { MedicineService } from "./medicine.service";
import sendResponse from "../../shared/sendResponse";
import { fileUploader } from "../../helper/fileUploader";

const create = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  if (req.file) {
    const uploadedImage =
      await fileUploader.uploadToCloudinary(req.file);

    if (!uploadedImage?.secure_url) {
      throw new Error("Medicine image upload failed");
    }

    payload.image = uploadedImage.secure_url;
  }

  const result = await MedicineService.createIntoDB(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Medicine created successfully",
    data: result,
  });
});

export const MedicineController = {
  create,
};
