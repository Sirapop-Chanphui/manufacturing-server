import PostService from "../service/postService.mjs";

const PostController = {
  getPostById: async (req, res, next) => {
    try {
      const post = await PostService.getPostById(req.params.postId);

      if (!post) {
        const error = new Error("Server could not find a requested post");
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        data: {
          image: post.image,
          category_id: post.category_id,
          title: post.title,
          description: post.description,
          content: post.content,
          status_id: post.status_id,
          likes_count: post.likes_count,
          created_at: post.created_at,
          updated_at: post.updated_at,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  createPost: async (req, res, next) => {
    try {
      const {
        title,
        image,
        category_id,
        description,
        content,
        status_id,
      } = req.body;

      await PostService.createPost({
        title,
        image,
        category_id,
        description,
        content,
        status_id,
      });

      return res.status(201).json({
        message: "Create post successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const { category, keyword } = req.query;

      const currentPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
      const pageLimit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 6, 1),
        20
      );
      const offset = (currentPage - 1) * pageLimit;

      const rows = await PostService.getAllPosts({
        category,
        keyword,
        pageLimit,
        offset,
      });

      const totalPosts = rows[0]?.total_posts || 0;
      const totalPages = Math.ceil(totalPosts / pageLimit);

      return res.status(200).json({
        totalPosts,
        totalPages,
        currentPage,
        limit: pageLimit,
        posts: rows,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
      });
    } catch (error) {
      return next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
        await PostService.updatePost(req.params.postId, req.body);

        res.status(200).json({
            message: "Updated post successfully",
        });
    } catch (error) {
        next(error);
    }
}
,

  deletePost: async (req, res, next) => {
    try {
      const { postId } = req.params;

      const deletedPost = await PostService.deletePost(postId);

      if (!deletedPost) {
        const error = new Error(
          "Server could not find a requested post to delete"
        );
        error.statusCode = 404;
        throw error;
      }

      return res.status(200).json({
        message: "Deleted post sucessfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};
export default PostController; 