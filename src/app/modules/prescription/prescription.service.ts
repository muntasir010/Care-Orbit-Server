import httpStatus from "http-status";
import {
  AppointmentStatus,
  PaymentStatus,
  UserRole,
  type Prescription,
} from "@prisma/client";
import type { IAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";

const createPrescription = async (
  user: IAuthUser,
  payload: Partial<Prescription>,
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not authorized to create prescription for this appointment",
      );
    }
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

// Task: Get all prescriptions for a patient
// Task: Get prescription by ID

export const PrescriptionService = {
  createPrescription,
};
