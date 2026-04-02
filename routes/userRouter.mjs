import { Router } from "express";
import UserController from "../controllers/userController.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";
import { imageFileUpload } from "../middlewares/uploadMiddleware.mjs";
import UserValidation from "../middlewares/userValidation.mjs";

const userRouter = Router();

userRouter.get(
  "/get-user",
  protectMiddleware,
  UserController.fetchUser
);

userRouter.put(
  "/profile",
  protectMiddleware,
  imageFileUpload,
  UserValidation.validateUpdateProfile,
  UserController.updateProfile
);

userRouter.put(
  "/password",
  protectMiddleware,
  UserValidation.validateUpdatePassword,
  UserController.updatePassword
);

export default userRouter;