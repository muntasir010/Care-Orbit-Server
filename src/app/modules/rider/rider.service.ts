import prisma from "../../shared/prisma";

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

const updateRiderAvailability = async (
  id: string,
  isAvailable: boolean,
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
    data: {
      isAvailable,
    },
  });
};

export const RiderService = {
  getAllRiders,
  getRiderById,
  updateRider,
  updateRiderAvailability,
};
