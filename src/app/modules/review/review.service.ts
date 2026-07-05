import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import type { IAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";

const insertIntoDB = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (patientData.id !== appointmentData.patientId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not authorized to give review for this appointment",
    );
  }

  return await prisma.$transaction(async (tnx) => {
    const result = await tnx.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: patientData.id,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    const avgRating = await tnx.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointmentData.doctorId,
      },
    });

    await tnx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRating: avgRating._avg.rating as number,
      },
    });

    return result;
  });
};

export const ReviewService = {
  insertIntoDB,
};
