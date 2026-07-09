import httpStatus from "http-status";
import { PaymentStatus, UserRole } from "@prisma/client";
import type { IAuthUser } from "../../interfaces/common";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metadata;
  switch (user?.role) {
    case UserRole.ADMIN:
      metadata = await getAdminMetaData();
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

const getAdminMetaData = async () => {
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    patientCount,
    doctorCount,
    adminCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
    barChartData,
    pieChartData,
  };
};

const getBarChartData = async () => {
  const appointmentCountPerMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC("month", "createdAt") AS month
    CAST(COUNT (*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC
    `;

  return appointmentCountPerMonth;
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => {
      status;
      Number(_count.id);
    });

  return formattedAppointmentStatusDistribution;
};

export const MetaService = {
  fetchDashboardMetaData,
};
