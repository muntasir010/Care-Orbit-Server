import httpStatus from "http-status";
import { DeliveryStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";

const getAllRiders = async () => {
  return prisma.rider.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
        },
      },
      _count: {
        select: {
          assignments: true,
          riderReviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRiderById = async (id: string) => {
  return prisma.rider.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
        },
      },
      _count: {
        select: {
          assignments: true,
          riderReviews: true,
        },
      },
    },
  });
};

const updateRider = async (
  id: string,
  payload: {
    name?: string;
    contactNumber?: string;
    address?: string;
  },
) => {
  await prisma.rider.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return prisma.rider.update({
    where: {
      id,
    },
    data: payload,
  });
};

const updateRiderAvailability = async (id: string, isAvailable: boolean) => {
  await prisma.rider.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return prisma.rider.update({
    where: {
      id,
    },
    data: {
      isAvailable,
    },
  });
};

const deleteRider = async (id: string) => {
  const rider = await prisma.rider.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const activeAssignment = await prisma.medicineDeliveryAssignment.findFirst({
    where: {
      riderId: rider.id,
      status: {
        in: [
          DeliveryStatus.ASSIGNED,
          DeliveryStatus.PICKED_UP,
          DeliveryStatus.ON_THE_WAY,
        ],
      },
    },
  });

  if (activeAssignment) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rider has active deliveries. Complete or reassign them before deleting this rider.",
    );
  }

  return prisma.rider.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      isAvailable: false,
    },
  });
};

export const RiderService = {
  getAllRiders,
  getRiderById,
  updateRider,
  updateRiderAvailability,
  deleteRider,
};
