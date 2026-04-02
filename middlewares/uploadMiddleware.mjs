import multer from "multer";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — align with frontend
const ALLOWED_IMAGE_MIMETYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_MIMETYPES.has(file.mimetype)) {
      return cb(null, true);
    }
    const err = new Error(
      "Only JPEG, PNG, GIF, and WebP images are allowed"
    );
    err.statusCode = 400;
    err.fieldErrors = {
      imageFile:
        "Invalid image type. Allowed: JPEG, PNG, GIF, WebP.",
    };
    cb(err);
  },
});

export const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);
