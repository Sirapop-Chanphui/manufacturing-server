/**
 * Role-based middleware - ใช้ร่วมกับ protectMiddleware
 * ต้องวาง protectMiddleware ก่อนเสมอ เพื่อให้ req.user มีค่า
 * example usage
 * router.get("/admin", protectMiddleware, restrictTo("admin"), controller);
 * router.get("/profile", protectMiddleware, restrictTo("user", "admin"), controller);

 */

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

