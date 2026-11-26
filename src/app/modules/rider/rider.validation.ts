import z from "zod";

const updateRiderZodSchema = z.object({
  name: z.string().min(1).optional(),
  contactNumber: z.string().min(1).optional(),
  address: z.string().optional(),
});

const updateAvailabilityZodSchema = z.object({
  isAvailable: z.boolean(),
});

const updateDeliveryStatusZodSchema = z.object({
  status: z.enum(["PICKED_UP", "ON_THE_WAY", "DELIVERED", "FAILED"]),
});

const updateLocationZodSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().nonnegative().optional(),
});

export const RiderValidation = {
  updateRiderZodSchema,
  updateAvailabilityZodSchema,
  updateDeliveryStatusZodSchema,
  updateLocationZodSchema,
};
