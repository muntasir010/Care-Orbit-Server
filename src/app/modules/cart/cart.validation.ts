import { z } from "zod";

const addToCartSchema = z.object({
  medicineId: z.string().uuid("Invalid medicine ID"),
  quantity: z.number().int().positive().default(1),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(
    "Quantity must be greater than 0",
  ),
});

export const CartValidation = {
  addToCartSchema,
  updateCartItemSchema,
};