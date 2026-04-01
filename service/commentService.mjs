import CommentRepository from "../repositories/commentRepository.mjs";

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
    const commentLimit = 3;
    const offset = (currentPage - 1) * commentLimit;
    const rows = await CommentRepository.findByPostId(postId, commentLimit, offset);

    const totalComments = rows[0]?.total_comments || 0;
    const totalPages = Math.ceil(totalComments / commentLimit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      comments: rows,
      totalComments,
      totalPages,
      currentPage,
      limit: commentLimit,
      nextPage,
    };

  }

};

export default CommentService;
