import z from "zod";

const updateRiderZodSchema = z.object({
  name: z.string().min(1).optional(),
  contactNumber: z.string().min(1).optional(),
  address: z.string().optional(),
});

const updateAvailabilityZodSchema = z.object({
  isAvailable: z.boolean(),
});

export const RiderValidation = {
  updateRiderZodSchema,
    updateAvailabilityZodSchema,
};