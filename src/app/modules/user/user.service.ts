import { type Request } from "express";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helper/fileUploader";
import config from "../../config/config";
import { type Patient, UserRole } from "@prisma/client";

const CreatePatient = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    if (!uploadedProfileImage?.secure_url) {
      throw new Error("Profile image upload failed");
    }
    req.body.patient.profilePhoto = uploadedProfileImage.secure_url;
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

// const CreatePatient = async (req: Request): Promise<Patient> => {
//     const file = req.file;

//     if (file) {
//         const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
//         req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
//     }

//     const hashedPassword: string = await bcrypt.hash(req.body.password, Number(config.salt_round))

//     const userData = {
//         email: req.body.patient.email,
//         password: hashedPassword,
//         role: UserRole.PATIENT
//     }

//     const result = await prisma.$transaction(async (transactionClient) => {
//         await transactionClient.user.create({
//             data: {
//                 ...userData,
//                 needPasswordChange: false
//             }
//         });

//         const createdPatientData = await transactionClient.patient.create({
//             data: req.body.patient
//         });

//         return createdPatientData;
//     });

//     return result;
// };

export const UserService = {
  CreatePatient,
};
