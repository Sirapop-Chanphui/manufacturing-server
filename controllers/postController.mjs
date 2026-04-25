import PostService from "../service/postService.mjs";
import CommentService from "../service/commentService.mjs";

const PostController = {
  getPostById: async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const userId = req.user?.id || null; // กันกรณี guest

      const post = await PostService.getPostById(postId, userId);

      if (!post) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      const data = {
        id: post.id,
        image: post.image,
        category_id: post.category_id,
        category: post.category,
        title: post.title,
        description: post.description,
        content: post.content,
        status_id: post.status_id,
        status: post.status,
        likes_count: post.likes_count,
        is_liked: post.is_liked,
        created_at: post.created_at,
        updated_at: post.updated_at,
      };

      if (req.query.include === "comments") {
        const commentsPayload = await CommentService.getCommentsByPost(
          Number(postId),
          req.query
        );
        data.comments = commentsPayload;
      }

      return res.status(200).json({ data });
    } catch (error) {
      return next(error);
    }
  },


  createPost: async (req, res, next) => {
    try {
      const postData = req.validatedBody || req.body;
      const file = req.files.imageFile[0];

      await PostService.createPost(postData, file);

      return res.status(201).json({
        message: "Create post successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const result = await PostService.getAllPosts(req.query);

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  getAllPostsForAdmin: async (req, res, next) => {
    try {
      const result = await PostService.getAllPostsForAdmin(req.query);

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const postData = req.validatedBody || req.body;

      const file = req.files?.imageFile?.[0] || null;

      await PostService.updatePost(req.params.postId, postData, file);

      return res.status(200).json({
        message: "Updated post successfully",
      });
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      return next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      await PostService.deletePost(req.params.postId);

      return res.status(200).json({
        message: "Deleted post successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};
export default PostController; 