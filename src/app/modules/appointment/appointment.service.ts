import { stripe } from "../../helper/stripe";
import type { IAuthUser } from "../../interfaces/common";
import prisma from "../../shared/prisma";
import { v4 as uuidV4 } from "uuid";

const createAppointment = async (
  user: IAuthUser,
  payload: { doctorId: string; scheduleId: string },
) => {
  const patientData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
      isDeleted: false,
    },
  });

  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidV4();

  const result = await prisma.$transaction(async (tnx) => {
    const appointmentData = await tnx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
    });

    await tnx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: payload.doctorId,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
      },
    });

    const transactionId = uuidV4();

    const paymentData = await tnx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: { name: `Appointment with Dr. ${doctorData.name}` },
            unit_amount: doctorData.appointmentFee * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],

      metadata: {
        appointmentId: appointmentData.id,
        paymentId: paymentData.id,
      },

      success_url: `https://web.programming-hero.com/`,
      cancel_url: `https://web.programming-hero.com/success`,
    });
    console.log(session);
    return { paymentUrl: session.url };
  });

  return result;
};

export const AppointmentService = {
  createAppointment,
};
