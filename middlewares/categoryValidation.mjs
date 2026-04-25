import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const categorySchema = z.object({
  name: z.string().min(1),
}).strict();

const CategoryValidation = {
  validateCreate: (req, res, next) => {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }

    req.validatedBody = result.data;
    next();
  },

  validateUpdate: (req, res, next) => {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }

    req.validatedBody = result.data;
    next();
  },
};

export default CategoryValidation;
