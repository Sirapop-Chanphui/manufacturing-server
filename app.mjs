import 'dotenv/config'
import express from "express";
import connectionPool from "./utils/db.mjs";
import corsMiddleware from "./middlewares/corsMiddleware.mjs";
import postsRouter from "./routes/postRouter.mjs";
import categoryRouter from "./routes/categoryRouter.mjs";
import adminRouter from "./routes/adminRouter.mjs";
import authRouter from "./routes/authRouter.mjs";
import userRouter from './routes/userRouter.mjs';
import errorHandler from "./middlewares/errorHandler.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(corsMiddleware);


app.get("/", (req, res) => {
    res.send("server is running...");
});

app.get("/db-test", async (req, res) => {
    try {

        const result = await connectionPool.query("SELECT * FROM posts");
        res.json(result.rows);
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: "DB connection failed" });
    }
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.use("/posts", postsRouter);
app.use("/categories", categoryRouter);

// Global error handler (must be after all routes)
app.use(errorHandler);

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

export default app;





