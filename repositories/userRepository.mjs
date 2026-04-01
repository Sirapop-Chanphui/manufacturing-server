import connectionPool from "../utils/db.mjs";

const UserRepository = {

  findById: async (id) => {
    const result = await connectionPool.query(
      `
      SELECT id, email, username, name, role, password, created_at, profile_pic, bio
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  },
};

export default UserRepository;
