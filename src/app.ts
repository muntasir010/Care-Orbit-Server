import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { PaymentController } from "./app/modules/payment/payment.controller";
import cron from "node-cron"
import { AppointmentService } from "./app/modules/appointment/appointment.service";

const app: Application = express();

app.post(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

cron.schedule('* * * * *', () => {
 try{
  AppointmentService.cancelUnpaidAppointments()
 }catch(err){
  console.log(err)
 }
});

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "CareOrbit Server is running!",
    env: process.env.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " seconds",
    timestamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
