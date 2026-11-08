import type Stripe from "stripe";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

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

          await tx.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              status: PaymentStatus.PAID,
              paymentGatewayData: JSON.parse(JSON.stringify(session)),
            },
          });

          await tx.medicineOrder.update({
            where: {
              id: medicineOrderId,
            },
            data: {
              paymentStatus: "PAID",
              transactionId: session.payment_intent
                ? String(session.payment_intent)
                : undefined,
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
