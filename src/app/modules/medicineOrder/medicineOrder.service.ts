import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";
import { IAuthUser } from "../../interfaces/common";

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


export const MedicineOrderService = {
  createOrder,
};