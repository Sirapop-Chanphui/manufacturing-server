import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const postSchema = z.object({
  title: z.string().min(1),
  image: z.string().url().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  status: z.string().min(1),
});

const PostsValidation = {
  validatePost: (req, res, next) => {
    const result = postSchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }

    // ข้อมูลที่ผ่านการ validate แล้ว
    req.validatedBody = result.data;
    next();
  },
  
};

export default PostsValidation;


