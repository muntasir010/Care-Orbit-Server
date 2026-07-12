import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidation } from "./doctorScheduleValidation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DoctorScheduleController } from "./doctorSchedule.controller";

const router = express.Router();

router.post(
  "/",
  validateRequest(
    DoctorScheduleValidation.createDoctorScheduleValidationSchema,
  ),
  DoctorScheduleController.insertIntoDB,
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleController.getMySchedule,
);

export const DoctorScheduleRoutes = router;
