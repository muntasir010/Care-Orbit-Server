import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { doctorSchedulesRoutes } from "../modules/doctorSchedules/doctorSchedules.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/schedules",
    route: doctorSchedulesRoutes,
  }
];

moduleRoutes.forEach((module) => {
  router.use(module.path, module.route);
});

export default router;
