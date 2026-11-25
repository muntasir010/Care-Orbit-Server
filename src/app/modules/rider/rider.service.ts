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

export const RiderService = {
  getAllRiders,
  getRiderById,
};
