const errorHandler = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Validation error",
      errors: {
        formErrors: [],
        fieldErrors: {
          imageFile: "File must be 5MB or smaller",
        },
      },
    });
  }

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

