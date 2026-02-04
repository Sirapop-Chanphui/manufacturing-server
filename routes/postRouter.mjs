import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import postsValidation from "../middlewares/postsValidation.mjs"

const postsRouter = Router();

//post 
postsRouter.post("/", postsValidation, async (req, res) => {
  try {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = req.body;

    await connectionPool.query(
      `
      INSERT INTO posts 
      (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [title, image, category_id, description, content, status_id]
    );

    res.status(201).json({
      message: "Create post successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "message": "Server could not create post because database connection" });
  }
});

//get post by id
postsRouter.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await connectionPool.query(
      `
      SELECT *
      FROM posts
      JOIN categories ON posts.category_id = categories.id
      JOIN statuses ON posts.status_id = statuses.id
      WHERE posts.id = $1
      `,
      [postId]
    );

    // ❌ not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    // ✅ success
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "message": "Server could not read post because database connection" });
  }
});

//get all post (limit post page) --> pagination
postsRouter.get("/", async (req, res) => {
  try {
    const { category, keyword } = req.query;

    const currentPage = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 20);
    const offset = (currentPage - 1) * pageLimit;

    const conditions = [];
    const values = [];

    if (category) {
      values.push(`%${category}%`);
      conditions.push(`categories.name ILIKE $${values.length}`);
    }

    if (keyword) {
      values.push(`%${keyword}%`);
      conditions.push(`
        (
          posts.title ILIKE $${values.length}
          OR posts.description ILIKE $${values.length}
          OR posts.content ILIKE $${values.length}
        )
      `);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await connectionPool.query(
      `
      SELECT
        posts.id,
        posts.title,
        posts.description,
        posts.created_at,
        categories.name AS category,
        statuses.status AS status,
        COUNT(*) OVER()::int AS total_posts
      FROM posts
      LEFT JOIN categories ON posts.category_id = categories.id
      LEFT JOIN statuses ON posts.status_id = statuses.id
      ${whereClause}
      ORDER BY posts.created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, pageLimit, offset]
    );

    const totalPosts = rows[0]?.total_posts || 0;
    const totalPages = Math.ceil(totalPosts / pageLimit);

    res.status(200).json({
      totalPosts,
      totalPages,
      currentPage,
      limit: pageLimit,
      posts: rows,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});


//update post by id
postsRouter.put("/:postId", postsValidation, async (req, res) => {
  try {
    const { postId } = req.params;
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
    } = req.body;

    // 1️⃣ เช็กว่ามี post นี้จริงไหม
    const checkPost = await connectionPool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to update",
      });
    }

    // 2️⃣ update post
    await connectionPool.query(
      `
      UPDATE posts
      SET
        title = $1,
        image = $2,
        category_id = $3,
        description = $4,
        content = $5,
        status_id = $6
      WHERE id = $7
      `,
      [
        title,
        image,
        category_id,
        description,
        content,
        status_id,
        postId,
      ]
    );

    // 3️⃣ success
    return res.status(200).json({
      message: "Updated post sucessfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});

//delete post by id
postsRouter.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // มี post นี้ไหม
    const checkPost = await connectionPool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (checkPost.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    // ลบ post
    await connectionPool.query(
      "DELETE FROM posts WHERE id = $1",
      [postId]
    );

    // success
    return res.status(200).json({
      message: "Deleted post sucessfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "message": "Server could not delete post because database connection" });
  }
});


export default postsRouter;
