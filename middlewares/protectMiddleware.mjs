import jwt from "jsonwebtoken";

const protectMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            const err = new Error("Unauthorized: Token missing");
            err.statusCode = 401;
            return next(err);
          }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        const err = new Error("Token is invalid or expired");
        err.statusCode = 401;
        return next(err);

    }
};

export default protectMiddleware;
