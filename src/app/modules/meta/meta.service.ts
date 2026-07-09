import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import type { IAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metadata;
  switch (user?.role) {
    case UserRole.ADMIN:
      metadata = "Admin Metadata";
      break;

    case UserRole.DOCTOR:
      metadata = "Doctor Metadata";
      break;

    case UserRole.PATIENT:
      metadata = "Patient Metadata";
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role!");
  }

  return metadata;
};

export const MetaService = {
  fetchDashboardMetaData,
};
