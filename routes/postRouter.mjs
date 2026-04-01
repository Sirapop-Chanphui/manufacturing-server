import { Router } from "express";
import PostController from "../controllers/postController.mjs";
import CommentController from "../controllers/commentController.mjs";
import authOptional from "../middlewares/authOptional.mjs";
import protectMiddleware from "../middlewares/protectMiddleware.mjs";
import { restrictTo } from "../middlewares/roleMiddleware.mjs";

const postsRouter = Router();

// List posts (public, published only)
postsRouter.get("/", PostController.getAllPosts);

// Comments belong to a post — nested under /posts/:postId/comments (register before /:postId)
postsRouter.get("/:postId/comments", CommentController.getCommentsByPost);
postsRouter.post(
  "/:postId/comments",
  protectMiddleware,
  restrictTo("user", "admin"),
  CommentController.createComment
);

// Single post (public); optional ?include=comments merges paginated comments into the response
postsRouter.get("/:postId", authOptional, PostController.getPostById);

export default postsRouter;
