/**
 * Express Error Handler Middleware
 * A centralized error-handling middleware for the application.
 *
 * @author Thang Truong
 * @date 2025-12-30
 */

/**
 * A centralized error handler middleware.
 *
 * This function catches errors passed from other routes or middleware.
 * It logs the error and sends a standardized JSON response to the client.
 *
 * @param {Error} err The error object.
 * @param {object} req The Express request object.
 * @param {object} res The Express response object.
 * @param {function} next The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Determine the status code, default to 500 if not set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Send a standardized error response
  res.status(statusCode).json({
    message: err.message,
    // In development mode, include the stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
