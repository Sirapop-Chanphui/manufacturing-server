import { z } from "zod";
import formatZodError from "../utils/formatZodError.mjs";

const truthyForm = (v) =>
  v === true || v === "true" || v === "1" || v === "on";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  username: z.string().min(3).max(50),
  /** multipart ส่งมาเป็น string — ใช้ลบรูปโปรไฟล์อย่างชัดเจน (ไม่ส่ง = ไม่ลบรูป) */
  removeProfileImage: z.preprocess((v) => {
    if (v === undefined || v === null || v === "") return false;
    return truthyForm(v);
  }, z.boolean()),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

const UserValidation = {
  validateUpdateProfile: (req, res, next) => {
    const result = updateProfileSchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = formatZodError(result.error).fieldErrors;
      return next(err);
    }

    req.validatedBody = result.data;
    next();
  },

  validateUpdatePassword: (req, res, next) => {
    const result = updatePasswordSchema.safeParse(req.body);

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

export default UserValidation;
