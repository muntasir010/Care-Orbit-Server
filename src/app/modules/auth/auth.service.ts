import jwt from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { jwtHelper } from "../../helper/jwtHelper";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isCorrectPassword) {
    throw new AppError(401, "Password is incorrect!");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "abcd",
    "1h",
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    "bcd",
    "90d",
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
