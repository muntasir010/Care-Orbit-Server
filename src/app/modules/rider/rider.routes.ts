import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { RiderController } from "./rider.controller";
import type { Request, Response, NextFunction } from "express";
import { RiderValidation } from "./rider.validation";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  RiderController.getAllRiders,
);

router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  RiderController.getRiderById,
);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = RiderValidation.updateRiderZodSchema.parse(req.body);
    next();
  },
  RiderController.updateRider,
);

router.patch(
  "/:id/availability",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = RiderValidation.updateAvailabilityZodSchema.parse(req.body);
    next();
  },
  RiderController.updateRiderAvailability,
);

export const RiderRoutes = router;
