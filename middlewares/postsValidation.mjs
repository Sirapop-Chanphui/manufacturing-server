import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const postSchema = z.object({
  title: z.string().min(1),
  category_id: z.coerce.number(),
  description: z.string().min(1),
  content: z.string().min(1),
  status_id: z.coerce.number(),
});

const updatePostSchema = z.object({
  title: z.string().min(1),
  category_id: z.coerce.number().int().positive(),
  description: z.string().min(1),
  content: z.string().optional(),
  status_id: z.coerce.number().int().positive(),
});



const PostsValidation = {
  validatePost: (req, res, next) => {

    const result = postSchema.safeParse(req.body);

    if (!req.files?.imageFile?.length) {
      return next({
        message: "Validation error",
        statusCode: 400,
        fieldErrors: { imageFile: "Image is required" },
      });
    }

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

  validateUpdatePost: (req, res, next) => {
    const result = updatePostSchema.safeParse(req.body);
  
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

export default PostsValidation;


