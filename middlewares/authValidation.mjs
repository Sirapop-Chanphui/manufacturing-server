import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  name: z.string().min(1),
  password: z.string().min(6),
}).strict();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict();

const AuthValidation = {
  validateRegister: (req, res, next) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }

    req.validatedBody = result.data;

    next();
  },

  validateLogin: (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

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

export default AuthValidation;

