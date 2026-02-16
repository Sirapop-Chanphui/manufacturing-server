import { Router } from "express";
import CategoryController from "../controllers/categoryController.mjs";

const categoryRouter = Router();

categoryRouter.get("/", CategoryController.getAll);
categoryRouter.get("/:id", CategoryController.getById);

export default categoryRouter;
