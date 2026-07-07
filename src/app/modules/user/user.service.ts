import httpStatus from "http-status";
import { type Request } from "express";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../config/config";
import { paginationHelper } from "../../interfaces/paginationHelper";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import { userSearchableFields } from "./user.constants";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";
import type { IAuthUser } from "../../interfaces/common";

const getAllUsers = async (params: any, options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filerData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filerData).length > 0) {
    andConditions.push({
      AND: Object.keys(filerData).map((key) => ({
        [key]: {
          equals: (filerData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const CreateAdmin = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadProfileImage = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfileImage?.secure_url) {
      throw new AppError(httpStatus.BAD_REQUEST, "Profile image upload failed");
    }
    req.body.admin.profilePhoto = uploadProfileImage?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });
    return await tnx.admin.create({
      data: req.body.admin,
    });
  });
  return result;
};

const CreateDoctor = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    if (!uploadedProfileImage?.secure_url) {
      throw new AppError(httpStatus.BAD_REQUEST, "Profile image upload failed");
    }
    req.body.doctor.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR,
      },
    });
    return await tnx.doctor.create({
      data: req.body.doctor,
    });
  });
  return result;
};

const CreatePatient = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    if (!uploadedProfileImage?.secure_url) {
      throw new AppError(httpStatus.BAD_REQUEST, "Profile image upload failed");
    }
    req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round),
  );
  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });
    return await tnx.patient.create({
      data: req.body.patient,
    });
  });
  return result;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileData;

  if (userInfo.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileData = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }
  
  return {
    ...userInfo,
    ...profileData,
  };
};

export const UserService = {
  getAllUsers,
  CreatePatient,
  CreateDoctor,
  CreateAdmin,
  getMyProfile,
};
