import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Something went wrong!";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if ((err.code = "P2002")) {
      ((message =
        "This record already exists. Please try with different data."),
        (err = err.meta));
      statusCode = httpStatus.CONFLICT;
    }
    if ((err.code = "P1000")) {
      ((message = "Database connection issue. Please try again later."),
        (err = err.meta));
      statusCode = httpStatus.BAD_GATEWAY;
    }
    if ((err.code = "P2003")) {
      ((message =
        "This data is linked with another record and cannot be changed."),
        (err = err.meta));
      statusCode = httpStatus.BAD_REQUEST;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message =
      "The data format is incorrect or some required fields are missing.";
    err = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = "An unexpected error occurred. Please try again later.";
    err = err.message;
    statusCode = httpStatus.BAD_REQUEST;
  }else if(err instanceof Prisma.PrismaClientInitializationError){
    message = "Could not connect to the database. Please check your internet or server status."
    err= err.message;
    statusCode = httpStatus.BAD_REQUEST;

  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources: err.errors || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
export default globalErrorHandler;
