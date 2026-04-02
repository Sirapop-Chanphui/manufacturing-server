import connectionPool from "../utils/db.mjs";

const CategoryRepository = {
  create: async (data) => {
    const { name } = data;
    const result = await connectionPool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await connectionPool.query(
      "SELECT id, name FROM categories ORDER BY name"
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await connectionPool.query(
      "SELECT id, name FROM categories WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  update: async (id, data) => {
    const { name } = data;
    const result = await connectionPool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name",
      [name, id]
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await connectionPool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id, name",
      [id]
    );
    return result.rows[0] || null;
  },
};

export default CategoryRepository;
