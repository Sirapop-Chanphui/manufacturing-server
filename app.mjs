import 'dotenv/config'
import express from "express";
import connectionPool from "./utils/db.mjs";
import corsMiddleware from "./middlewares/corsMiddleware.mjs";
import postsRouter from './routes/postRouter.mjs';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use(corsMiddleware);
  

app.get("/", (req, res) => {
    res.send("Hello TechUp!");
});

app.use("/posts", postsRouter);

app.get("/db-test", async (req, res) => {
    try {

        const result = await connectionPool.query("SELECT * FROM posts");
        res.json(result.rows);
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "DB connection failed" });
    }
});




app.get("/profiles", (req, res) => {
    res.status(200).json({
        "data": {
            "name": "john",
            "age": 20
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
