import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { MedicineValidation } from "./medicine.validation";
import { z } from "zod";

type CreateMedicinePayload = z.infer<
  typeof MedicineValidation.createMedicineSchema
>;

const createIntoDB = async (payload: CreateMedicinePayload) => {
  const { category, form, ...medicineData } = payload;

  const data: Prisma.MedicineCreateInput = {
    ...medicineData,

    dosageForm: form,

    category: {
      connectOrCreate: {
        where: {
          name: category,
        },
        create: {
          name: category,
        },
      },
    },
  };

  return prisma.medicine.create({
    data,
    include: {
      category: true,
    },
  });
};

export const MedicineService = {
  createIntoDB,
};
