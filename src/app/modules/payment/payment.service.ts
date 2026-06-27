import type Stripe from "stripe";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const appointmentId = session.metadata?.appointmentId;
      const paymentId = session.metadata?.paymentId;

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          paymentStatus:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status:
            session.payment_status === "paid"
              ? PaymentStatus.PAID
              : PaymentStatus.UNPAID,
          paymentGatewayData: JSON.parse(JSON.stringify(session)),
        },
      });

      console.log("Payment successfully");
      console.log("Appointment ID:", appointmentId);
      console.log("Payment ID:", paymentId);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentService = {
  handleWebhookEvent,
};
