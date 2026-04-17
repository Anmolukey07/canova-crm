export function errorHandler(error, request, response, next) {
  console.error("Error:", error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map((err) => err.message),
    });
  }

  if (error.code === 11000) {
    return response.status(400).json({
      success: false,
      message: "Duplicate field value",
      field: Object.keys(error.keyPattern)[0],
    });
  }

  response.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
}
