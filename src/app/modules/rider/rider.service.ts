import httpStatus from "http-status";
import { DeliveryStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";

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

const getMyDeliveries = async (authUser: IAuthUser) => {
  const rider = await prisma.rider.findFirstOrThrow({
    where: {
      email: authUser?.email,
      isDeleted: false,
    },
  });

  return prisma.medicineDeliveryAssignment.findMany({
    where: {
      riderId: rider.id,
    },
    include: {
      order: {
        include: {
          items: {
            include: {
              medicine: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  strength: true,
                  form: true,
                },
              },
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              address: true,
            },
          },
        },
      },
      locations: {
        orderBy: {
          recordedAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });
};

export const RiderService = {
  getAllRiders,
  getRiderById,
  updateRider,
  updateRiderAvailability,
  deleteRider,
  getMyDeliveries,
};
