import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import AppError from "../errors/AppError";

const validateBody =
  (schema: ZodTypeAny) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let input = req.body;
      if (input && typeof input.data === "string") {
        try {
          input = JSON.parse(input.data);
        } catch {
          throw new AppError(400, "Field `data` must be valid JSON");
        }
      }
      req.body = await schema.parseAsync(input ?? {});
      next();
    } catch (err) {
      next(err);
    }
  };

export default validateBody;
