import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1),
  image: z.string().url().min(1),
  category_id: z.number().int(),
  description: z.string().min(1),
  content: z.string().min(1),
  status_id: z.number().int(),
});

const PostsValidation = {
  validatePost: (req, res, next) => {
    const result = postSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    // ข้อมูลที่ผ่านการ validate แล้ว
    req.body = result.data;
    next();
  },
  
};

export default PostsValidation;


