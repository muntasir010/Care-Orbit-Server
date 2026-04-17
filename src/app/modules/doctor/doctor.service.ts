import type { Prisma } from "@prisma/client";
import {
  paginationHelper,
  type IOptions,
} from "../../interfaces/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";

const getAllFromDB = async (filters: any, options: IOptions) => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andCondition: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    OR: doctorSearchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andCondition.push(...filterConditions)
  }
};

export const DoctorService = {
  getAllFromDB,
};
