import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../helper/fileUploader";
import validateBody from "../../middlewares/validateBody";
import { MedicineOrderController } from "./medicine.controller";
import { MedicineOrderValidation } from "./medicineOrderValidation";

const router = Router();

// Patient Routes
router.get("/my", auth(UserRole.PATIENT), MedicineOrderController.getMyOrders);

router.post(
  "/",
  auth(UserRole.PATIENT),
  fileUploader.prescriptionUpload.single("prescription"),
  validateBody(MedicineOrderValidation.createOrderSchema),
  MedicineOrderController.createOrder,
);

// Get Order By ID (Patient + Admin)
router.get(
  "/:id",
  auth(UserRole.PATIENT, UserRole.ADMIN),
  MedicineOrderController.getOrderById,
);

// Admin Routes
router.get("/", auth(UserRole.ADMIN), MedicineOrderController.getAllOrders);

export const MedicineOrderRoutes = router;
