import CommentRepository from "../repositories/commentRepository.mjs";

const DEFAULT_COMMENT_LIMIT = 5;
const MAX_COMMENT_LIMIT = 50;

const CommentService = {

  createComment: async ({ postId, userId, comment_text }) => {

    if (!comment_text || comment_text.trim() === "") {
      const err = new Error("Comment text is required");
      err.statusCode = 400;
      throw err;
    }

    return await CommentRepository.create({
      postId,
      userId,
      comment_text
    });
  },

  getCommentsByPost: async (postId, query) => {
    const currentPage = Math.max(parseInt(query.page, 10) || 1, 1);
    const parsedLimit = parseInt(query?.limit, 10);
    const commentLimit = Math.min(
      Math.max(
        Number.isFinite(parsedLimit) && parsedLimit > 0
          ? parsedLimit
          : DEFAULT_COMMENT_LIMIT,
        1
      ),
      MAX_COMMENT_LIMIT
    );
    const offset = (currentPage - 1) * commentLimit;
    const rows = await CommentRepository.findByPostId(postId, commentLimit, offset);

    const totalComments = rows[0]?.total_comments || 0;
    const totalPages =
      totalComments === 0 ? 0 : Math.ceil(totalComments / commentLimit);
    const nextPage =
      totalPages > 0 && currentPage < totalPages ? currentPage + 1 : null;

    return {
      comments: rows,
      totalComments,
      totalPages,
      currentPage,
      limit: commentLimit,
      nextPage,
    };
  },

};

export default CommentService;
