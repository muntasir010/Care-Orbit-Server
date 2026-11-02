import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CartController } from "./cart.controller";
import { CartValidation } from "./cart.validation";
import validateBody from "../../middlewares/validateBody";

const router = express.Router();

router.get("/", auth(UserRole.PATIENT), CartController.getMyCart);

router.post(
  "/items",
  auth(UserRole.PATIENT),
  validateBody(CartValidation.addToCartSchema),
  CartController.addToCart,
);

router.patch(
  "/items/:id",
  auth(UserRole.PATIENT),
  validateBody(CartValidation.updateCartItemSchema),
  CartController.updateCartItem,
);

router.delete(
  "/items/:id",
  auth(UserRole.PATIENT),
  CartController.removeCartItem,
);

router.delete(
  "/",
  auth(UserRole.PATIENT),
  CartController.clearCart,
);

export const CartRoutes = router;
