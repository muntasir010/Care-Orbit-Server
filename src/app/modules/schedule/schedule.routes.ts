import express from 'express';
import { ScheduleControllers } from './schedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.get(
    '/', auth(UserRole.DOCTOR, UserRole.ADMIN),
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