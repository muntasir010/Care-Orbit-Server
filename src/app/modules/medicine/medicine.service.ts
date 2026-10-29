import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { MedicineValidation } from "./medicine.validation";
import { z } from "zod";
import {
  IPaginationOptions,
  paginationHelper,
} from "../../interfaces/paginationHelper";
import { medicineSearchableFields } from "./medicine.constant";
import AppError from "../../errors/AppError";

type CreateMedicinePayload = z.infer<
  typeof MedicineValidation.createMedicineSchema
>;

type UpdateMedicinePayload = z.infer<
  typeof MedicineValidation.updateMedicineSchema
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

const getAllFromDB = async (
  filters: Record<string, any>,
  options: IPaginationOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const {
    searchTerm,
    category,
    form,
    manufacturer,
    requiresPrescription,
    inStock,
    minPrice,
    maxPrice,
  } = filters;

  const and: Prisma.MedicineWhereInput[] = [{ isDeleted: false }];

  // 1) Search
  if (searchTerm) {
    and.push({
      OR: medicineSearchableFields.map((field) => ({
        [field]: { contains: String(searchTerm), mode: "insensitive" },
      })),
    });
  }

  // 2) Filters
  if (category)
    and.push({
      category: {
        is: {
          name: { equals: String(category), mode: "insensitive" },
        },
      },
    });

  if (manufacturer)
    and.push({
      manufacturer: { equals: String(manufacturer), mode: "insensitive" },
    });

  if (form) and.push({ dosageForm: form as any });

  if (requiresPrescription !== undefined && requiresPrescription !== "")
    and.push({
      requiresPrescription:
        requiresPrescription === "true" || requiresPrescription === true,
    });

  if (inStock === "true" || inStock === true) and.push({ stock: { gt: 0 } });

  // 3) Price range
  if (minPrice || maxPrice) {
    and.push({
      price: {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      },
    });
  }

  const where: Prisma.MedicineWhereInput = { AND: and };

  const [data, total] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.medicine.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getCategories = async () => {
  return prisma.medicineCategory
    .findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            medicines: {
              where: { isDeleted: false },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
    .then((categories) =>
      categories.map((category) => ({
        id: category.id,
        category: category.name,
        count: category._count.medicines,
      })),
    );
};

const getByIdFromDB = async (id: string) => {
  const medicine = await prisma.medicine.findFirst({
    where: { id, isDeleted: false },
  });
  if (!medicine) throw new AppError(404, "Medicine not found");
  return medicine;
};

const updateIntoDB = async (id: string, payload: UpdateMedicinePayload) => {
  await getByIdFromDB(id);

  const { category, form, ...medicineData } = payload;

  const data: Prisma.MedicineUpdateInput = {
    ...medicineData,

    ...(form !== undefined && {
      dosageForm: form,
    }),

    ...(category !== undefined && {
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    }),
  };

  return prisma.medicine.update({
    where: { id },
    data,
    include: { category: true },
  });
};

export const MedicineService = {
  createIntoDB,
  getAllFromDB,
  getCategories,
  getByIdFromDB,
  updateIntoDB,
};
