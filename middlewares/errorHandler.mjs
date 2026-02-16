const errorHandler = (err, req, res, next) => {
  const statusCode = Number(err.statusCode) || 500;

  // ถ้าเป็น validation style error
  if (err.fieldErrors) {
    return res.status(statusCode).json({
      message: "Validation error",
      errors: {
        formErrors: [],
        fieldErrors: err.fieldErrors,
      },
    });
  }

  // default error
 return res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;

