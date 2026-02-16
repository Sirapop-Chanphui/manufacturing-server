import multer from "multer";

const multerUpload = multer({
  storage: multer.memoryStorage(),
});

export const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);
