import connectionPool from "../utils/db.mjs";

const UserRepository = {

  findById: async (id) => {
    const result = await connectionPool.query(
      `
      SELECT id, email, username, name, role, created_at, profile_pic, bio
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  },

  findPasswordHashById: async (id) => {
    const result = await connectionPool.query(
      `
      SELECT password FROM users WHERE id = $1
      `,
      [id]
    );

    return result.rows[0]?.password ?? null;
  },

  findByUsernameExcludingId: async (username, excludeId) => {
    const result = await connectionPool.query(
      `
      SELECT id FROM users WHERE username = $1 AND id <> $2
      `,
      [username, excludeId]
    );

    return result.rows[0] || null;
  },

  /**
   * profilePicMode: "keep" | "set" | "clear"
   * - keep: อัปเดตแค่ name, username
   * - set: ใส่ URL ใหม่
   * - clear: ตั้ง profile_pic เป็น NULL
   */
  updateProfile: async (id, { name, username, profilePicUrl, profilePicMode }) => {
    if (profilePicMode === "clear") {
      const result = await connectionPool.query(
        `
        UPDATE users
        SET name = $1, username = $2, profile_pic = NULL
        WHERE id = $3
        RETURNING id, email, username, name, role, created_at, profile_pic, bio
        `,
        [name, username, id]
      );
      return result.rows[0] || null;
    }

    if (profilePicMode === "set" && profilePicUrl != null) {
      const result = await connectionPool.query(
        `
        UPDATE users
        SET name = $1, username = $2, profile_pic = $3
        WHERE id = $4
        RETURNING id, email, username, name, role, created_at, profile_pic, bio
        `,
        [name, username, profilePicUrl, id]
      );
      return result.rows[0] || null;
    }

    const result = await connectionPool.query(
      `
      UPDATE users
      SET name = $1, username = $2
      WHERE id = $3
      RETURNING id, email, username, name, role, created_at, profile_pic, bio
      `,
      [name, username, id]
    );

    return result.rows[0] || null;
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await connectionPool.query(
      `
      UPDATE users SET password = $1 WHERE id = $2 RETURNING id
      `,
      [hashedPassword, id]
    );

    return result.rows[0] || null;
  },
};

export default UserRepository;
