import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const statusUpdateSchema = z.object({
  status: z.string().min(1),
}).strict();

const StatusValidation = {
  validateUpdate: (req, res, next) => {
    const result = statusUpdateSchema.safeParse(req.body);

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

export default StatusValidation;
