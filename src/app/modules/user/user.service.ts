import { type Request } from "express";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../config/config";

const getAllUsers = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  const result = await prisma.user.findMany({ skip, take: limit });
  return result;
};

const CreateAdmin = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadProfileImage = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfileImage?.secure_url) {
      throw new Error("Profile image upload failed");
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
      throw new Error("Profile image upload failed");
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
      throw new Error("Profile image upload failed");
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

export const UserService = {
  getAllUsers,
  CreatePatient,
  CreateDoctor,
  CreateAdmin,
};
