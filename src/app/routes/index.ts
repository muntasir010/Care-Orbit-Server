import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { schedulesRoutes } from "../modules/schedules/schedules.routes";
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
    route: schedulesRoutes,
  }
];

moduleRoutes.forEach((module) => {
  router.use(module.path, module.route);
});

export default router;
