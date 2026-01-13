import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources: err.errors || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
export default globalErrorHandler;