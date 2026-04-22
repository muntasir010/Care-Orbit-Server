import express from 'express';
import { DoctorController } from './doctor.controller';

const router = express.Router()

router.get("/", DoctorController.getAllFromDB);

router.patch("/", DoctorController.updateIntoDB)

export const DoctorRoutes = router;