import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import { stripe } from "../../helper/stripe";

const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Error while verifying webhook signature: ${err}`);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  const result = await PaymentService.handleWebhookEvent(event);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook event handled successfully",
    data: result,
  });
});

export const PaymentController = {
  handleStripeWebhookEvent,
};