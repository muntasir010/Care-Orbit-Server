import type { NextFunction, Response, Request } from "express";
import type { ZodObject } from "zod";

const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
      });
      next();
    } catch (err) {
      next(err);
    }
  };

  export default validateRequest;