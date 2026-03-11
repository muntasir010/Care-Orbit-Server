import type { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import { jwtHelper } from "../helper/jwtHelper";
import config from "../config/config";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new AppError(401, "You are not authorized");
      }
      const verifyUser = jwtHelper.verifyToken(token, config.jwt.access_secret);
      req.user = verifyUser;
      if(roles.length && !roles.includes(verifyUser.role) ){
        throw new AppError(401, "You are not authorized")
      }
    } catch (err) {
        next(err)
    }
  };
};

export default auth;
