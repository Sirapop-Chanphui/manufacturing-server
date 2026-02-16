import jwt from "jsonwebtoken";

const authOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(); // ไม่มี token ก็ปล่อยผ่าน
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // ⭐ ใส่ user ลง req
  } catch (error) {
    // token invalid ก็ไม่ต้อง error
  }

  next();
};

export default authOptional;
