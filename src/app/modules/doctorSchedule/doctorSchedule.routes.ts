import express from 'express';
import { DoctorController } from './doctorSchedule.controller';

const router = express.Router();

router.post("/", DoctorController.insertIntoDB);

export const DoctorScheduleRoutes = router;