import express from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  ScheduleControllers.schedulesForDoctor,
);

router.post("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ScheduleControllers.insertIntoDB);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleControllers.deleteSchedulesFromDB,
);

export const schedulesRoutes = router;
