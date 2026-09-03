import httpStatus from "http-status";
import { UserStatus, type Doctor, type Prisma } from "@prisma/client";
import {
  IPaginationOptions,
  paginationHelper,
} from "../../interfaces/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import prisma from "../../shared/prisma";
import type {
  IDoctorFilterRequest,
  IDoctorUpdateInput,
} from "./doctor.interface";
import AppError from "../../errors/AppError";
import { openai } from "../../helper/open-router";
import { extractJsonForFetch } from "../../helper/extractJsonForFetch";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions,
) => {
  const { page, skip, limit } = paginationHelper.calculatePagination(options);
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

  // doctor > doctorSpecialties > specialties -> title
  // Handle multiple specialties: ?specialties=Cardiology&specialties=Neurology
  if (specialties && specialties.length > 0) {
    andCondition.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
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

  andCondition.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { averageRating: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: {
            select: {
              title: true,
            },
          },
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      review: {
        select: {
          rating: true,
        },
      },
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

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      review: true,
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: IDoctorUpdateInput) => {
  const { specialties, removeSpecialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tnx) => {
    // Step 1: Update doctor basic data
    if (Object.keys(doctorData).length > 0) {
      await tnx.doctor.update({
        where: {
          id,
        },
        data: doctorData,
      });
    }

    // Step 2: Remove specialties if provided
    if (
      removeSpecialties &&
      Array.isArray(removeSpecialties) &&
      removeSpecialties.length > 0
    ) {
      const existingDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: {
          doctorId: doctorInfo.id,
          specialtiesId: {
            in: removeSpecialties,
          },
        },
      });

      if (existingDoctorSpecialties.length !== removeSpecialties.length) {
        const foundIds = existingDoctorSpecialties.map(
          (ds) => ds.specialtiesId,
        );
        const notFound = removeSpecialties.filter(
          (id) => !foundIds.includes(id),
        );
        throw new Error(
          `Cannot remove non-existent specialties: ${notFound.join(", ")}`,
        );
      }

      // Delete the specialties
      await tnx.doctorSpecialties.deleteMany({
        where: {
          doctorId: doctorInfo.id,
          specialtiesId: {
            in: removeSpecialties,
          },
        },
      });
    }

    // Step 3: Add new specialties if provided
    if (specialties && Array.isArray(specialties) && specialties.length > 0) {
      // Verify all specialties exist in Specialties table
      const existingSpecialties = await tnx.specialties.findMany({
        where: {
          id: {
            in: specialties,
          },
        },
        select: {
          id: true,
        },
      });

      const existingSpecialtyIds = existingSpecialties.map((s) => s.id);
      const invalidSpecialties = specialties.filter(
        (id) => !existingSpecialtyIds.includes(id),
      );

      if (invalidSpecialties.length > 0) {
        throw new Error(
          `Invalid specialty IDs: ${invalidSpecialties.join(", ")}`,
        );
      }

      // Check for duplicates - don't add specialties that already exist
      const currentDoctorSpecialties = await tnx.doctorSpecialties.findMany({
        where: {
          doctorId: doctorInfo.id,
          specialtiesId: {
            in: specialties,
          },
        },
        select: {
          specialtiesId: true,
        },
      });

      const currentSpecialtyIds = currentDoctorSpecialties.map(
        (ds) => ds.specialtiesId,
      );
      const newSpecialties = specialties.filter(
        (id) => !currentSpecialtyIds.includes(id),
      );

      // Only create new specialties that don't already exist
      if (newSpecialties.length > 0) {
        const doctorSpecialtiesData = newSpecialties.map((specialtyId) => ({
          doctorId: doctorInfo.id,
          specialtiesId: specialtyId,
        }));

        await tnx.doctorSpecialties.createMany({
          data: doctorSpecialtiesData,
        });
      }
    }
  });

  // Step 4: Return updated doctor with specialties
  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

const getAISuggestions = async (payload: { symptom: string }) => {
  if (!(payload && payload.symptom)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Symptom required");
  }

  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const prompt = `You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 suitable doctors.
  Each doctor has specialties and years of experience.
  Only suggest doctors who are relevant to the given symptom.
  
  Symptoms: ${payload.symptom}
  
  Here is the doctor list (in JSON): ${JSON.stringify(doctors, null, 2)}
  
  Return your response in JSON format with full individual doctor data.`;

  const completion = await openai.chat.completions.create({
    model: "tencent/hy3-preview:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI medical assistant that provides doctor suggestions.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = await extractJsonForFetch(completion.choices[0]?.message);

  return result;
};

export const DoctorService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
  getAISuggestions,
};
