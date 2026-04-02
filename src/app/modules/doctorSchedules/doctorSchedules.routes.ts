import express from 'express';
import { DoctorScheduleControllers } from './doctorSchedules.controller';

const router = express.Router();

router.post("/create-schedules", DoctorScheduleControllers.insertIntoDB);

export const doctorSchedulesRoutes= router;