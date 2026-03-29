import express from 'express';
import { ScheduleControllers } from './schedules.controller';


const router = express.Router();

router.post("/create-schedules", ScheduleControllers.insertIntoDB);

export const schedulesRoutes= router;