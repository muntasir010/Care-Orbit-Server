import express from 'express';
import { DoctorScheduleControllers } from './doctorSchedules.controller';

const router = express.Router();

router.get(
    '/',
    DoctorScheduleControllers.schedulesForDoctor
)

router.post(
    '/',
    DoctorScheduleControllers.insertIntoDB
);

router.delete(
    '/:id',
    DoctorScheduleControllers.deleteSchedulesFromDB
);



export const doctorSchedulesRoutes= router;