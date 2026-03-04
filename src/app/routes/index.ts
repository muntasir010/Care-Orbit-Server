import express from "express";
import { userRoutes } from "../modules/user/user.routes";
const router = express.Router();

const moduleRoutes = [
    {
        path: "/users",
        route: userRoutes
    }
]

moduleRoutes.forEach((module) => {
    router.use(module.path, module.route);
});

export default router;