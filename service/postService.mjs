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
        const updatedPost = await PostRepository.update(postId, postData);
    
        if (!updatedPost) {
            const err = new Error("Post not found");
            err.statusCode = 404;
            throw err;
        }
    
        return updatedPost;
    }
    ,

    deletePost: async (req, res, next) => {
        try {
            await PostService.deletePost(req.params.postId);
    
            return res.status(200).json({
                message: "Deleted post successfully",
            });
        } catch (error) {
            return next(error);
        }
    }
    
    
}

export default PostService
