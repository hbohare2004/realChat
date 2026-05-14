/**
 * Global Error Handler Middleware
 * Catches all errors thrown in the application and returns
 * a consistent JSON error response.
 */

import config from "../config/index.js";
import logger from "../utils/logger.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ─── Mongoose Bad ObjectId ─────────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ─── Mongoose Duplicate Key ────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue).join(", ");
    message = `Duplicate value for field: ${field}. Please use a different value.`;
  }

  // ─── Mongoose Validation Error ─────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(". ");
  }

  // ─── JWT Errors ────────────────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please log in again.";
  }

  // Log error in development
  if (config.nodeEnv === "development") {
    logger.error(`${statusCode} - ${message}`);
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
    ...(err.errors?.length && { errors: err.errors }),
  });
};

export default errorHandler;
