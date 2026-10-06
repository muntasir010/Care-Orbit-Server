import type Stripe from "stripe";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        throw new Error(
          "Missing appointmentId or paymentId in Stripe session metadata",
        );
      }

      const isPaid = session.payment_status === "paid";

      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus: isPaid
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: isPaid
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
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
