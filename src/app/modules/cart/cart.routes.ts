import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CartController } from "./cart.controller";
import { CartValidation } from "./cart.validation";
import validateBody from "../../middlewares/validateBody";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.PATIENT),
  CartController.getMyCart,
);

router.post(
  "/items",
  auth(UserRole.PATIENT),
  validateBody(CartValidation.addToCartSchema),
  CartController.addToCart,
);

export const CartRoutes = router;