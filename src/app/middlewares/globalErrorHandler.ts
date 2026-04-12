import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code = "P2002"){
      message="This record already exists. Please try with different data.",
      err= err.meta
    }
    if(err.code = "P1000"){
      message= "Database connection issue. Please try again later.",
      err= err.meta
    }
    if(err.code = "P2003"){
      message= "This data is linked with another record and cannot be changed.",
      err = err.meta
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
export default globalErrorHandler;