import express from "express";
import { PatientsController } from "./patients.controller";

const router = express.Router();

router.get("/", PatientsController.getAllFromDB);

router.get("/:id", PatientsController.getByIdFromDB);

export const PatientRoutes = router;
