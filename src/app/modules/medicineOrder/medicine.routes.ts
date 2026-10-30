import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import validateBody from "../../middlewares/validateBody";
import { MedicineOrderController } from "./medicine.controller";
import { MedicineOrderValidation } from "./medicineOrderValidation";

const router = Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  fileUploader.prescriptionUpload.single("prescription"),
  validateBody(MedicineOrderValidation.createOrderSchema),
  MedicineOrderController.createOrder,
);

export const MedicineOrderRoutes = router;