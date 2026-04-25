import CommentService from "../service/commentService.mjs";

const CommentController = {
    createComment: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { comment_text } = req.body;

            const userId = req.user.id; 

             await CommentService.createComment({
                postId: Number(postId),
                userId,
                comment_text
            });

            res.status(201).json({
                message: "Comment created successfully",
            });

        } catch (error) {
            next(error);
        }
    },

    getCommentsByPost: async (req, res, next) => {
        try {
            const { postId} = req.params;

            const comments = await CommentService.getCommentsByPost(Number(postId), req.query);

            res.status(200).json({
                data: comments
            });

        } catch (error) {
            next(error);
        }
    },
}

export default CommentController;

