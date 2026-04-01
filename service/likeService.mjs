import LikeRepository from "../repositories/likeRepository.mjs";

const LikeService = {
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
