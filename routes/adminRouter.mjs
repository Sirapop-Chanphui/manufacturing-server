import { Router } from "express";
import PostController from "../controllers/postController.mjs";
import CategoryController from "../controllers/categoryController.mjs";
import StatusController from "../controllers/statusController.mjs";
import PostsValidation from "../middlewares/postsValidation.mjs";
import CategoryValidation from "../middlewares/categoryValidation.mjs";
import StatusValidation from "../middlewares/statusValidation.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";
import { restrictTo } from "../middlewares/roleMiddleware.mjs";

const adminRouter = Router();

adminRouter.use(protectMiddleware);
adminRouter.use(restrictTo("admin"));

// Categories (admin: create, update, delete)
adminRouter.post(
  "/categories",
  CategoryValidation.validateCreate,
  CategoryController.create
);
adminRouter.put(
  "/categories/:id",
  CategoryValidation.validateUpdate,
  CategoryController.update
);
adminRouter.delete("/categories/:id", CategoryController.delete);

// Statuses (admin only)
adminRouter.get("/statuses", StatusController.getAll);
adminRouter.get("/statuses/:id", StatusController.getById);
adminRouter.put(
  "/statuses/:id",
  StatusValidation.validateUpdate,
  StatusController.update
);
adminRouter.delete("/statuses/:id", StatusController.delete);

// Posts (admin only)
adminRouter.get("/posts", PostController.getAllPostsForAdmin);

// Create post
adminRouter.post(
  "/posts",
  PostsValidation.validatePost,
  PostController.createPost
);

// Update post
adminRouter.put(
  "/posts/:postId",
  PostsValidation.validatePost,
  PostController.updatePost
);

// Delete post
adminRouter.delete("/posts/:postId", PostController.deletePost);

export default adminRouter;