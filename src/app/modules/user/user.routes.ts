import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers)

// admin
router.post(
  "/create-admin", auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdminZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreateAdmin(req, res, next);
  },
);

// doctor
router.post(
  "/create-doctor", auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreateDoctor(req, res, next);
  },
);

// patient
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreatePatient(req, res, next);
  },
);


export const userRoutes = router;
