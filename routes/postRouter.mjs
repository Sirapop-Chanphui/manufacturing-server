import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import postsValidation from "../middlewares/postsValidation.mjs"

const postsRouter = Router();

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

export default postsRouter;
