import type Stripe from "stripe";
import prisma from "../../shared/prisma";
import { MedicinePaymentStatus, PaymentStatus } from "@prisma/client";

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const isPaid = session.payment_status === "paid";

      if (!isPaid) {
        break;
      }

      const orderType = session.metadata?.orderType;

      // Medicine Order Payment
      if (orderType === "MEDICINE_ORDER") {
        const medicineOrderId = session.metadata?.medicineOrderId;
        const paymentId = session.metadata?.paymentId;

        if (!medicineOrderId || !paymentId) {
          throw new Error(
            "Missing medicineOrderId or paymentId in Stripe metadata",
          );
        }

        await prisma.$transaction(async (tx) => {
          const payment = await tx.payment.findUnique({
            where: {
              id: paymentId,
            },
          });

          if (!payment || payment.medicineOrderId !== medicineOrderId) {
            throw new Error("Medicine order payment record not found");
          }

          if (payment.status === PaymentStatus.PAID) {
            return;
          }

          const order = await tx.medicineOrder.findUnique({
            where: {
              id: medicineOrderId,
            },
          });

          if (!order) {
            throw new Error("Medicine order not found");
          }

          if (order.status === "CANCELLED") {
            throw new Error("Cannot complete payment for a cancelled order");
          }

          const transactionId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id;

          await tx.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status: PaymentStatus.PAID,
              transactionId: transactionId ?? payment.transactionId,
              paymentGatewayData: JSON.parse(JSON.stringify(session)),
            },
          });

          await tx.medicineOrder.update({
            where: {
              id: medicineOrderId,
            },
            data: {
              paymentStatus: MedicinePaymentStatus.PAID,
              transactionId: transactionId ?? order.transactionId,
            },
          });
        });

        break;
      }

      // Appointment Payment
      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        throw new Error(
          "Missing appointmentId or paymentId in Stripe session metadata",
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: JSON.parse(JSON.stringify(session)),
          },
        });
      });

      break;
    }

    default:
  }
};

export const PaymentService = {
  handleWebhookEvent,
};
