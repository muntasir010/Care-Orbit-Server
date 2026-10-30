import { z } from "zod";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        medicineId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1),
  shippingName: z.string().min(2),
  shippingPhone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  shippingAddress: z.string().min(5),
  paymentMethod: z.enum(["COD", "ONLINE"]).default("COD"),
  note: z.string().optional(),
  prescriptionUrl: z.string().url().optional(),
});

export const MedicineOrderValidation = { createOrderSchema };
