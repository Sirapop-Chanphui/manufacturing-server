import PostRepository from "../repositories/postRepository.mjs";

const PostService = {
    getPostById: async (postId) => {
        return await PostRepository.findById(postId);
    },

    createPost: async (postData) => {
        return await PostRepository.create(postData);
    },

    getAllPosts: async (filters) => {
        return await PostRepository.findAll(filters);
    },

    updatePost: async (postId, postData) => {
        const exists = await PostRepository.checkExists(postId);
        if (!exists) {
            return null;
        }
        return await PostRepository.update(postId, postData);
    },

    deletePost: async (postId) => {
        const exists = await PostRepository.checkExists(postId);
        if (!exists) {
            return null;
        }
        return await PostRepository.delete(postId);
    }
}

export default PostService