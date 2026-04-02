import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const postIdParamSchema = z.object({
  postId: z.coerce.number().int().positive(),
});

const LikeValidation = {
  validatePostIdParam: (req, res, next) => {
    const result = postIdParamSchema.safeParse(req.params);
    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }
    req.validatedParams = result.data;
    next();
  },
};

export default LikeValidation;
