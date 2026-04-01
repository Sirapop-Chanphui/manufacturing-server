import LikeRepository from "../repositories/likeRepository.mjs";

const LikeService = {
  getLikeStatus: async (postId, userId) => {
    const result = await LikeRepository.getLikeStatus(postId, userId);

    if (!result) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }

    return result;
  },

  toggleLike: async (postId, userId) => {
    const result = await LikeRepository.toggleLike(postId, userId);

    if (!result) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }

    return result;
  },
};

export default LikeService;
