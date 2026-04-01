import LikeService from "../service/likeService.mjs";

const LikeController = {
  /**
   * GET — optional auth: guest always gets isLiked false; logged-in user gets real state.
   */
  getLikeStatus: async (req, res, next) => {
    try {
      const { postId } = req.validatedParams;
      const userId = req.user?.id ?? null;

      const { isLiked } = await LikeService.getLikeStatus(postId, userId);

      return res.status(200).json({
        data: {
          isLiked,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  toggleLike: async (req, res, next) => {
    try {
      const { postId } = req.validatedParams;
      const userId = req.user.id;

      const { isLiked, likes_count } = await LikeService.toggleLike(postId, userId);

      return res.status(200).json({
        data: {
          isLiked,
          likes_count,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default LikeController;
