import { IAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";

const cartInclude = {
  items: {
    include: {
      medicine: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc" as const,
    },
  },
};

// Get Patient and Create Cart if not exists
const getPatientCart = async (user: IAuthUser) => {
  const dbUser = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
    include: {
      patient: true,
    },
  });

  if (
    !dbUser ||
    dbUser.role !== "PATIENT" ||
    !dbUser.patient ||
    dbUser.patient.isDeleted
  ) {
    throw new Error("Patient profile not found");
  }

  const cart = await prisma.cart.upsert({
    where: {
      patientId: dbUser.patient.id,
    },
    update: {},
    create: {
      patientId: dbUser.patient.id,
    },
  });

  return cart;
};

// Get My Cart
const getMyCart = async (user: IAuthUser) => {
  const cart = await getPatientCart(user);

  const result = await prisma.cart.findUnique({
    where: {
      id: cart.id,
    },
    include: cartInclude,
  });

  const subtotal =
    result?.items.reduce((total, item) => {
      const discountedPrice =
        item.medicine.price *
        (1 - item.medicine.discountPercent / 100);

      return total + discountedPrice * item.quantity;
    }, 0) ?? 0;

  const totalItems =
    result?.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ) ?? 0;

  return {
    ...result,
    subtotal: Number(subtotal.toFixed(2)),
    totalItems,
  };
};

// Add Medicine to Cart
const addToCart = async (
  user: IAuthUser,
  payload: {
    medicineId: string;
    quantity: number;
  },
) => {
  const cart = await getPatientCart(user);

  const medicine = await prisma.medicine.findFirst({
    where: {
      id: payload.medicineId,
      isActive: true,
      isDeleted: false,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found or unavailable");
  }

  if (medicine.stock < payload.quantity) {
    throw new Error(`Only ${medicine.stock} items are available`);
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId: payload.medicineId,
      },
    },
  });

  const newQuantity =
    (existingItem?.quantity ?? 0) + payload.quantity;

  if (newQuantity > medicine.stock) {
    throw new Error(`Only ${medicine.stock} items are available`);
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_medicineId: {
        cartId: cart.id,
        medicineId: payload.medicineId,
      },
    },
    update: {
      quantity: newQuantity,
    },
    create: {
      cartId: cart.id,
      medicineId: payload.medicineId,
      quantity: payload.quantity,
    },
  });

  return getMyCart(user);
};



export const CartService = {
  getMyCart,
  addToCart,
};
