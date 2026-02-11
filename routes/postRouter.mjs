import { Router } from "express";
import PostsValidation from "../middlewares/postsValidation.mjs";
import PostController from "../controllers/postController.mjs";

const postsRouter = Router();

// Create post
postsRouter.post("/", PostsValidation.validatePost, PostController.createPost);

// Get all posts (with pagination)
postsRouter.get("/", PostController.getAllPosts);

// Get post by id
postsRouter.get("/:postId", PostController.getPostById);

// Update post by id
postsRouter.put("/:postId", PostsValidation.validatePost, PostController.updatePost);

// Delete post by id
postsRouter.delete("/:postId", PostController.deletePost);


export default postsRouter;
