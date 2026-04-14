import express from "express";
import { DoctorController } from "./doctorSchedule.controller";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorScheduleValidation";

const router = express.Router();

router.post(
  "/",
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema,
  ),
  DoctorController.insertIntoDB,
);

export const DoctorScheduleRoutes = router;
