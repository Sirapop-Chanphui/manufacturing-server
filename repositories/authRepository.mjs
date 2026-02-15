import connectionPool from "../utils/db.mjs";

const AuthRepository = {
  createUser: async (registerData) => {
    const { email, username, name, password } = registerData;

    const result = await connectionPool.query(
      `
      INSERT INTO users
      (email, username, name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, name, role, created_at
      `,
      [email, username, name, password]
    );

    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await connectionPool.query(
      `
      SELECT id, email, username, name, role, password, created_at
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    return result.rows[0] || null;
  },

  findById: async (id) => {
    const result = await connectionPool.query(
      `
      SELECT id, email, username, name, role, password, created_at
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0] || null;
  },
};

export default AuthRepository;
