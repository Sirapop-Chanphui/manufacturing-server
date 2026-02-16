import { Router } from "express";
import PostController from "../controllers/postController.mjs";
import authOptional from "../middlewares/authOptional.mjs";

const postsRouter = Router();

// Get all posts (public, published only, filter: category, keyword)
postsRouter.get("/", PostController.getAllPosts);

// Get post by id (public)
postsRouter.get("/:postId", authOptional, PostController.getPostById);

export default postsRouter;
