import connectionPool from "../utils/db.mjs";

const StatusRepository = {
  findAll: async () => {
    const result = await connectionPool.query(
      "SELECT id, status FROM statuses ORDER BY id"
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await connectionPool.query(
      "SELECT id, status FROM statuses WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  update: async (id, data) => {
    const { status } = data;
    const result = await connectionPool.query(
      "UPDATE statuses SET status = $1 WHERE id = $2 RETURNING id, status",
      [status, id]
    );
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await connectionPool.query(
      "DELETE FROM statuses WHERE id = $1 RETURNING id, status",
      [id]
    );
    return result.rows[0] || null;
  },
};

export default StatusRepository;
