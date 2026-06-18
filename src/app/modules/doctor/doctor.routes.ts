import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/suggestion", DoctorController.getAISuggestions);

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.patch("/", DoctorController.updateIntoDB);

router.delete("/:id", auth(UserRole.ADMIN), DoctorController.deleteFromDB);

router.delete("/soft/:id", auth(UserRole.ADMIN), DoctorController.softDelete);

export const DoctorRoutes = router;
