import PostRepository from "../repositories/postRepository.mjs";
import supabase from "../utils/supabaseClient.mjs";
import { removeStorageObjectByPublicUrl } from "../utils/supabaseStorageHelpers.mjs";

const DEFAULT_POST_USER_LIMIT = 6;
const MAX_LIMIT = 20;

const DEFAULT_POST_ADMINLIMIT = 20;


const PostService = {
  getPostById: async (postId, userId) => {
    const post = await PostRepository.findById(postId, userId);
    if (!post) {
      const err = new Error("Server could not find a requested post");
      err.statusCode = 404;
      throw err;
    }

    return post;
  },


  createPost: async (postData, file) => {
    const bucketName = "manufacturing-blog";
    let imageUrl = null;

    if (file) {
      const filePath = `posts/${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      imageUrl = publicUrl;
    }

    const { title, category_id, description, content, status_id } = postData;


    if (!category_id) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = { category: "Category not found" };
      throw err;
    }

    if (!status_id) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = { status: "Status not found" };
      throw err;
    }

    return await PostRepository.create({
      title,
      image: imageUrl,
      category_id,
      description,
      content,
      status_id,
    });
  },

  getAllPosts: async (query) => {
    const { category, keyword } = query;
    const currentPage = Math.max(parseInt(query.page, 10) || 1, 1);
    const pageLimit = Math.min(
      Math.max(parseInt(query.limit, 10) || DEFAULT_POST_USER_LIMIT, 1),
      MAX_LIMIT
    );
    const offset = (currentPage - 1) * pageLimit;

    const rows = await PostRepository.findAll({
      category,
      keyword,
      status: "published",
      pageLimit,
      offset,
    });

    const totalPosts = rows[0]?.total_posts || 0;
    const totalPages = Math.ceil(totalPosts / pageLimit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      posts: rows,
      totalPosts,
      totalPages,
      currentPage,
      limit: pageLimit,
      nextPage,
    };
  },

  getAllPostsForAdmin: async (query) => {
    const { category, keyword, title, status } = query;
    const currentPage = Math.max(parseInt(query.page, 10) || 1, 1);
    const pageLimit = Math.min(
      Math.max(parseInt(query.limit, 10) || DEFAULT_POST_ADMINLIMIT, 1),
      MAX_LIMIT
    );
    const offset = (currentPage - 1) * pageLimit;

    const rows = await PostRepository.findAll({
      category,
      keyword,
      title,
      status,
      pageLimit,
      offset,
    });

    const totalPosts = rows[0]?.total_posts || 0;
    const totalPages = Math.ceil(totalPosts / pageLimit);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return {
      posts: rows,
      totalPosts,
      totalPages,
      currentPage,
      limit: pageLimit,
      nextPage,
    };
  },

  updatePost: async (postId, postData, file) => {
    const bucketName = "manufacturing-blog";
  
    const { title, category_id, description, content, status_id } = postData;
  
    const fieldErrors = {};
    if (!category_id) fieldErrors.category = "Category not found";
    if (!status_id) fieldErrors.status = "Status not found";
  
    if (Object.keys(fieldErrors).length > 0) {
      const err = new Error("Validation error");
      err.statusCode = 400;
      err.fieldErrors = fieldErrors;
      throw err;
    }
  
    let updateData = {
      title,
      category_id,
      description,
      content,
      status_id,
    };
  
    let previousImageUrl = null;
    if (file) {
      previousImageUrl = await PostRepository.findImageById(postId);

      const filePath = `posts/${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(data.path);

      updateData.image = publicUrl;
    }

    const updatedPost = await PostRepository.update(postId, updateData);

    if (!updatedPost) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }

    if (file && previousImageUrl) {
      await removeStorageObjectByPublicUrl(
        supabase,
        bucketName,
        previousImageUrl
      );
    }

    return updatedPost;
  },
  

  deletePost: async (postId) => {
    const deletedPost = await PostRepository.delete(postId);

    if (!deletedPost) {
      const err = new Error(
        "Server could not find a requested post to delete"
      );
      err.statusCode = 404;
      throw err;
    }

    return deletedPost;
  },
};

export default PostService;
