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

router.get("/", auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), UserController.getAllUsers);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile,
);

// admin
router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN),
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
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
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

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.changeProfileStatus,
);

router.patch(
    "/update-my-profile",
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.updateMyProfile(req, res, next)
    }
);

export const UserRoutes = router;
