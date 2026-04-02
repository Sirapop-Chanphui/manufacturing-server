import connectionPool from "../utils/db.mjs";

const LikeRepository = {
  /**
   * Whether the post exists and if `userId` has liked it (false when userId is null / guest).
   * @returns {{ isLiked: boolean } | null} null if post does not exist
   */
  getLikeStatus: async (postId, userId) => {
    if (userId == null) {
      const postOnly = await connectionPool.query(
        `SELECT id FROM posts WHERE id = $1`,
        [postId]
      );
      if (postOnly.rowCount === 0) {
        return null;
      }
      return { isLiked: false };
    }
// ห้ระบุชนิดของพารามิเตอร์ $2 ชัดเจน — PostgreSQL ไม่สามารถอนุมานชนิดของ NULL ได้เมื่อใช้ร่วมกับ user_id = $2 (uuid)
    const result = await connectionPool.query(
      `SELECT EXISTS (
         SELECT 1 FROM likes l
         WHERE l.post_id = $1 AND l.user_id = $2::uuid
       ) AS is_liked
       FROM posts
       WHERE posts.id = $1`,
      [postId, userId]
    );

    if (result.rowCount === 0) {
      return null;
    }

    return { isLiked: result.rows[0].is_liked };
  },

  /**
   * Toggles like for a post in one transaction: insert+increment or delete+decrement.
   * @returns {{ isLiked: boolean, likes_count: number } | null} null if post does not exist
   */
  toggleLike: async (postId, userId) => {
    const client = await connectionPool.connect();
    try {
      await client.query("BEGIN");
      //lock for update
      const postResult = await client.query(
        `SELECT id FROM posts WHERE id = $1 FOR UPDATE`,
        [postId]
      );

      if (postResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      //check user ever like this post
      const existing = await client.query(
        `SELECT id FROM likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );

      const hadLike = existing.rowCount > 0;
      let updateResult;

      if (hadLike) {
        await client.query(
          `DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,
          [postId, userId]
        );
        updateResult = await client.query(
          `UPDATE posts
           SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
           WHERE id = $1
           RETURNING likes_count`,
          [postId]
        );
      } else {
        await client.query(
          `INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`,
          [postId, userId]
        );
        updateResult = await client.query(
          `UPDATE posts
           SET likes_count = COALESCE(likes_count, 0) + 1
           WHERE id = $1
           RETURNING likes_count`,
          [postId]
        );
      }

      await client.query("COMMIT");

      const likes_count = updateResult.rows[0].likes_count;
      const isLiked = !hadLike;

      return { isLiked, likes_count };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};

export default LikeRepository;
