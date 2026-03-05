import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreatePatientController(req, res, next);
  },
);

router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctorZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreateDoctorController(req, res, next);
  },
);


router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatientZodSchema.parse(
      JSON.parse(req.body.data),
    );
    return UserController.CreatePatientController(req, res, next);
  },
);


export const userRoutes = router;
