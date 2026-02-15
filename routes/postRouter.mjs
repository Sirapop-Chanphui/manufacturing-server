import { Router } from "express";
import PostsValidation from "../middlewares/postsValidation.mjs";
import PostController from "../controllers/postController.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";

const postsRouter = Router();

// Create post (protected)
postsRouter.post("/", protectMiddleware, PostsValidation.validatePost, PostController.createPost);

// Get all posts (public, with pagination)
postsRouter.get("/", PostController.getAllPosts);

// Get post by id (public)
postsRouter.get("/:postId", PostController.getPostById);

// Update post by id (protected)
postsRouter.put("/:postId", protectMiddleware, PostsValidation.validatePost, PostController.updatePost
);

// Delete post by id (protected)
postsRouter.delete("/:postId", protectMiddleware, PostController.deletePost);

export default postsRouter;
