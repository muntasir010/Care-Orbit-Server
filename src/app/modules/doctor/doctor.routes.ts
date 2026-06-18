import express from "express";
import { DoctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.post("/suggestion", DoctorController.getAISuggestions);

router.patch("/", DoctorController.updateIntoDB);

router.delete("/:id", auth(UserRole.ADMIN), DoctorController.deleteFromDB);

export const DoctorRoutes = router;
