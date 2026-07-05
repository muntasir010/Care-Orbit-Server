import express from "express";
import { PatientsController } from "./patients.controller";

const router = express.Router();

router.get("/", PatientsController.getAllFromDB);

export const PatientRoutes = router;
