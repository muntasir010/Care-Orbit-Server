import type { Prisma } from "@prisma/client";
import {
  paginationHelper,
  type IOptions,
} from "../../interfaces/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import prisma from "../../shared/prisma";
import type { IDoctorUpdateInput } from "./doctor.interface";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andCondition.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IDoctorUpdateInput>,
) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  const { specialties, ...doctorData } = payload;

  await prisma.$transaction(async (tnx) => {
    if (specialties && specialties.length > 0) {
      const deleteSpecialtyIds = specialties.filter(
        (specialty) => specialty.isDeleted,
      );

      for (const specialty of deleteSpecialtyIds) {
        await tnx.doctorSpecialties.deleteMany({
          where: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }

      const createSpecialtyIds = specialties.filter(
        (specialty) => !specialty.isDeleted,
      );

      for (const specialty of createSpecialtyIds) {
        await tnx.doctorSpecialties.create({
          data: {
            doctorId: id,
            specialtiesId: specialty.specialtyId,
          },
        });
      }
    }

    const updateData = await tnx.doctor.update({
      where: {
        id: doctorInfo.id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: {
          include: {
            specialties: true,
          },
        },
      },
    });
    return updateData;
  });
};

export const DoctorService = {
  getAllFromDB,
  updateIntoDB,
};
