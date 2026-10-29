import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { MedicineValidation } from "./medicine.validation";
import { MedicineController } from "./medicine.controller";
import { fileUploader } from "../../helper/fileUploader";
import validateBody from "../../middlewares/validateBody";

const router = express.Router();

router.get("/", MedicineController.getAllFromDB);
router.get("/categories", MedicineController.getCategories);

router.post(
  "/",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  validateBody(MedicineValidation.createMedicineSchema),
  MedicineController.create,
);

export const MedicineRoutes = router;
