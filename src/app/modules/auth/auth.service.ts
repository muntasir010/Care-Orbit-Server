import httpStatus from "http-status";
import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import AppError from "../../errors/AppError";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../config/config";
import prisma from "../../shared/prisma";
import type { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string; password: string }) => {
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
    throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect!");
  }

  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.access_secret,
    config.jwt.access_expires_in,
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;

  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelper.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
