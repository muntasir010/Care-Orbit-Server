import { MedicineOrderStatus, Prisma, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";
import {
  IPaginationOptions,
  paginationHelper,
} from "../../interfaces/paginationHelper";

type TCreateOrderPayload = {
  items: {
    medicineId: string;
    quantity: number;
  }[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note?: string;
  prescriptionUploadId?: string;
};

const orderInclude = {
  items: {
    include: {
      medicine: {
        select: {
          id: true,
          name: true,
          image: true,
          strength: true,
          dosageForm: true,
        },
      },
    },
  },
  patient: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.MedicineOrderInclude;

const getPatient = (email: string) => {
  return prisma.patient.findUniqueOrThrow({
    where: { email },
  });
};

const round2 = (value: number) => {
  return Math.round(value * 100) / 100;
};

const createOrder = async (user: IAuthUser, payload: TCreateOrderPayload) => {
  const patient = await getPatient(user?.email as string);

  // Duplicate medicine IDs quantity aggregation
  const quantityMap = new Map<string, number>();

  payload.items.forEach((item) => {
    quantityMap.set(
      item.medicineId,
      (quantityMap.get(item.medicineId) || 0) + item.quantity,
    );
  });

  const medicineIds = [...quantityMap.keys()];

  if (!medicineIds.length) {
    throw new AppError(400, "Order must contain at least one medicine");
  }

  return prisma.$transaction(async (tx) => {
    const medicines = await tx.medicine.findMany({
      where: {
        id: { in: medicineIds },
        isDeleted: false,
        isActive: true,
      },
    });

    if (medicines.length !== medicineIds.length) {
      throw new AppError(404, "One or more medicines not found");
    }

    let subtotal = 0;
    let needsPrescription = false;

    const itemsData: Prisma.MedicineOrderItemCreateWithoutOrderInput[] = [];

    for (const medicine of medicines) {
      const quantity = quantityMap.get(medicine.id)!;

      // Stock check and update
      const updated = await tx.medicine.updateMany({
        where: {
          id: medicine.id,
          stock: { gte: quantity },
          isDeleted: false,
          isActive: true,
        },
        data: {
          stock: { decrement: quantity },
        },
      });

      if (updated.count === 0) {
        throw new AppError(400, `Insufficient stock for ${medicine.name}`);
      }

      if (medicine.requiresPrescription) {
        needsPrescription = true;
      }

      const unitPrice = round2(
        medicine.price * (1 - medicine.discountPercent / 100),
      );

      const lineTotal = round2(unitPrice * quantity);

      subtotal += lineTotal;

      itemsData.push({
        medicine: {
          connect: { id: medicine.id },
        },
        name: medicine.name,
        quantity,
        unitPrice,
        lineTotal,
      });
    }

    if (needsPrescription && !payload.prescriptionUploadId) {
      throw new AppError(
        400,
        "Prescription is required for one or more medicines",
      );
    }

    const deliveryFee = 0;
    const discount = 0;
    const totalAmount = round2(subtotal - discount + deliveryFee);

    const orderNumber = `MO-${Date.now()}`;

    return tx.medicineOrder.create({
      data: {
        orderNumber,
        patient: {
          connect: { id: patient.id },
        },
        subtotal: round2(subtotal),
        discount,
        deliveryFee,
        totalAmount,
        shippingName: payload.shippingName,
        shippingPhone: payload.shippingPhone,
        shippingAddress: payload.shippingAddress,
        note: payload.note,
        prescriptionUpload: payload.prescriptionUploadId
          ? { connect: { id: payload.prescriptionUploadId } }
          : undefined,
        items: {
          create: itemsData,
        },
      },
      include: orderInclude,
    });
  });
};

const getOrders = async (
  filters: Record<string, any>,
  options: IPaginationOptions,
  baseWhere: Prisma.MedicineOrderWhereInput,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, status, paymentStatus, fromDate, toDate } = filters;

  const and: Prisma.MedicineOrderWhereInput[] = [baseWhere];

  if (searchTerm) {
    and.push({
      OR: [
        {
          orderNumber: {
            contains: String(searchTerm),
            mode: "insensitive",
          },
        },
        {
          shippingName: {
            contains: String(searchTerm),
            mode: "insensitive",
          },
        },
        {
          patient: {
            name: {
              contains: String(searchTerm),
              mode: "insensitive",
            },
          },
        },
        {
          patient: {
            email: {
              contains: String(searchTerm),
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  if (status) {
    and.push({ status: status as MedicineOrderStatus });
  }

  if (paymentStatus) {
    and.push({ paymentStatus: paymentStatus as any });
  }

  if (fromDate || toDate) {
    and.push({
      createdAt: {
        ...(fromDate && {
          gte: new Date(String(fromDate)),
        }),
        ...(toDate && {
          lte: new Date(`${toDate}T23:59:59.999Z`),
        }),
      },
    });
  }

  const where: Prisma.MedicineOrderWhereInput = {
    AND: and,
  };

  const [data, total] = await Promise.all([
    prisma.medicineOrder.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: orderInclude,
    }),

    prisma.medicineOrder.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getMyOrders = async (
  user: IAuthUser,
  filters: Record<string, any>,
  options: IPaginationOptions,
) => {
  const patient = await getPatient(user?.email as string);

  return getOrders(filters, options, { patientId: patient.id });
};

const getAllOrders = async (
  filters: Record<string, any>,
  options: IPaginationOptions,
) => {
  return getOrders(filters, options, {});
};

const getOrderById = async (user: IAuthUser, id: string) => {
  const order = await prisma.medicineOrder.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (user?.role !== UserRole.ADMIN) {
    const patient = await getPatient(user?.email!);

    if (order.patientId !== patient.id) {
      throw new AppError(403, "This is not your order");
    }
  }

  return order;
};

export const MedicineOrderService = {
  createOrder,
  getOrders,
  getMyOrders,
  getAllOrders,
  getOrderById,
};
