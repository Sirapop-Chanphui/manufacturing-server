import connectionPool from "../utils/db.mjs";

const PostRepository = {
    findCategoryIdByName: async (name) => {
        const result = await connectionPool.query(
            "SELECT id FROM categories WHERE name ILIKE $1",
            [name.trim()]
        );
        return result.rows[0]?.id || null;
    },

    findStatusIdByName: async (name) => {
        const result = await connectionPool.query(
            "SELECT id FROM statuses WHERE status ILIKE $1",
            [name.trim()]
        );
        return result.rows[0]?.id || null;
    },

    findById: async (postId, userId) => {
        const result = await connectionPool.query(
            `
            SELECT
                posts.id,
                posts.image,
                posts.category_id,
                posts.title,
                posts.description,
                posts.content,
                posts.status_id,
                posts.likes_count,
                posts.created_at,
                posts.updated_at,
                categories.name AS category,
                statuses.status AS status,
                CASE 
                    WHEN likes.user_id IS NOT NULL THEN true
                    ELSE false
                END AS is_liked
            FROM posts
            LEFT JOIN categories ON posts.category_id = categories.id
            LEFT JOIN statuses ON posts.status_id = statuses.id
            LEFT JOIN likes 
                ON posts.id = likes.post_id 
                AND likes.user_id = $2
            WHERE posts.id = $1
            `,
            [postId, userId]
        );
    
        return result.rows[0] || null;
    },
    

    create: async (postData) => {
        const { title, image, category_id, description, content, status_id } = postData;
        const result = await connectionPool.query(
            `
            INSERT INTO posts 
            (title, image, category_id, description, content, status_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [title, image, category_id, description, content, status_id]
        );
        return result.rows[0];
    },

    findAll: async (filters) => {
        const { category, keyword, title, status, pageLimit, offset } = filters;

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

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`posts.title ILIKE $${values.length}`);
        }

        if (status) {
            values.push(status);
            conditions.push(`statuses.status ILIKE $${values.length}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const result = await connectionPool.query(
            `
            SELECT
                posts.id,
                posts.title,
                posts.image,
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

        return result.rows;
    },

    update: async (postId, postData) => {
        const { title, image, category_id, description, content, status_id } = postData;
        const result = await connectionPool.query(
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
            RETURNING *
            `,
            [title, image, category_id, description, content, status_id, postId]
        );
        return result.rows[0] || null;
    },

    delete: async (postId) => {
        const result = await connectionPool.query(
            "DELETE FROM posts WHERE id = $1 RETURNING *",
            [postId]
        );
        return result.rows[0] || null;
    },

}

export default PostRepository