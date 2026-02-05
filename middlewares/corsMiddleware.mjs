import cors from "cors";

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // allow requests without origin (Postman)
    if (!origin) return callback(null, true);

    // local dev
    const localOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
    ];
    if (localOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow all vercel branches
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
});

export default corsMiddleware;
