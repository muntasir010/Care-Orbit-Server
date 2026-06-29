import httpStatus from 'http-status';
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { stripe } from "../../helper/stripe";
import type { IAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import { v4 as uuidV4 } from "uuid";
import {
  paginationHelper,
  type IOptions,
} from "../../interfaces/paginationHelper";
import AppError from "../../errors/AppError";

const createAppointment = async (
  user: IAuthUser,
  payload: { doctorId: string; scheduleId: string },
) => {
  const patientData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidV4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidV4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: `Appointment with Dr. ${doctorData.name}` },
            unit_amount: doctorData.appointmentFee * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],

      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },

      success_url: `https://web.programming-hero.com/`,
      cancel_url: `https://web.programming-hero.com/success`,
    });
    console.log(session);
    return { paymentUrl: session.url };
  });

  return result;
};

const getMyAppointment = async (
  user: IAuthUser,
  filters: any,
  options: IOptions,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { ...filterData } = filters;

  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));

    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include:
      user?.role === UserRole.DOCTOR
        ? {
            patient: true,
            schedule: true,
            prescription: true,
            review: true,
            payment: true,
            doctor: {
              include: {
                doctorSpecialties: {
                  include: {
                    specialties: true,
                  },
                },
              },
            },
          }
        : {
            doctor: {
              include: {
                doctorSpecialties: {
                  include: {
                    specialties: true,
                  },
                },
              },
            },
            schedule: true,
            prescription: true,
            review: true,
            payment: true,
            patient: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: IAuthUser,
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if(user?.role === UserRole.DOCTOR ){
    if(!(user.email === appointmentData.doctor.email))
      throw new AppError(httpStatus.BAD_REQUEST, "You are not the owner of this appointment");
  }

  return await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });
};

export const AppointmentService = {
  createAppointment,
  getMyAppointment,
  updateAppointmentStatus,
};
