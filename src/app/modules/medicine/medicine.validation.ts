import { z } from "zod";
import { medicineForms } from "./medicine.constant";

const createMedicineSchema = z.object({
  name: z.string().min(2),
  genericName: z.string().min(2),
  manufacturer: z.string().min(2),
  category: z.string().trim().min(2),
  form: z.enum(medicineForms).default("TABLET"),
  strength: z.string().optional(),
  packSize: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  price: z.number().positive(),
  discountPercent: z.number().min(0).max(90).default(0),
  stock: z.number().int().min(0),
  requiresPrescription: z.boolean().default(false),
});

const updateMedicineSchema = createMedicineSchema.partial();

export const MedicineValidation = {
  createMedicineSchema,
  updateMedicineSchema,
};
