import { Router } from "express";
import UserController from "../controllers/authController.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";

const userRouter = Router();

userRouter.get(
  "/get-user",
  protectMiddleware,
  UserController.fetchUser
);


export default userRouter;