import express from "express";
import connectionPool from "./utils/db.mjs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())

app.use(
    cors()
);

app.get("/", (req, res) => {
    res.send("Hello TechUp!");
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
