import connectionPool from "../utils/db.mjs";

const CommentRepository = {

  create: async ({ postId, userId, comment_text }) => {
    const query = `
      INSERT INTO comments (post_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [postId, userId, comment_text];

    const { rows } = await connectionPool.query(query, values);
    return rows[0];
  },

  findByPostId: async (postId, commentLimit, offset) => {

    const query = `
      SELECT  
      comments.id,
      comments.comment_text,
      comments.created_at,
      users.username,
      users.profile_pic,
      COUNT(*) OVER()::int AS total_comments
      FROM comments 
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at DESC
      LIMIT $2
      OFFSET $3
    `;

    const { rows } = await connectionPool.query(query, [postId, commentLimit, offset]);
    return rows;
  }

};

export default CommentRepository;
