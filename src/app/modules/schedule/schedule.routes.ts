import express from 'express';
import { ScheduleControllers } from './schedule.controller';

const router = express.Router();

router.get(
    '/',
    ScheduleControllers.schedulesForDoctor
)

router.post(
    '/',
    ScheduleControllers.insertIntoDB
);

router.delete(
    '/:id',
    ScheduleControllers.deleteSchedulesFromDB
);



export const schedulesRoutes= router;