import express from "express";
import { PatientsController } from "./patients.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", PatientsController.getAllFromDB);

router.get("/:id", PatientsController.getByIdFromDB);

router.patch("/", auth(UserRole.PATIENT), PatientsController.updateIntoDB);

router.delete("/soft/:id", PatientsController.softDelete);

export const PatientRoutes = router;
