import z from "zod";

const createPatientZodSchema = z.object({
  password: z.string(),
  patient: z.object({
    email: z.email(),
    name: z.string({
      error: "Name is required!",
    }),
    contactNumber: z
      .string({
        error: "Contact number is required!",
      })
      .optional(),
    address: z
      .string({
        error: "Address is required",
      })
      .optional(),
  }),
});

export const UserValidation = {
  createPatientZodSchema,
};
