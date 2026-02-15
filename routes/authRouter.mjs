import { Router } from "express";
import AuthController from "../controllers/authController.mjs";
import AuthValidation from "../middlewares/authValidation.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";

const authRouter = Router();

authRouter.get(
  "/get-user",
  protectMiddleware,
  AuthController.fetchUser
);

authRouter.post(
  "/register",
  AuthValidation.validateRegister,
  AuthController.register
);

authRouter.post(
  "/login",
  AuthValidation.validateLogin,
  AuthController.login
);

export default authRouter;