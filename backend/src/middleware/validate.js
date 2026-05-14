/**
 * Validation Middleware
 * Accepts a Joi schema and validates req.body against it.
 * Returns 400 with details if validation fails.
 */

import ApiError from "../utils/ApiError.js";

/**
 * Creates a validation middleware for the given Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Report all errors, not just the first
    stripUnknown: true, // Remove unknown fields
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    throw new ApiError(400, "Validation failed", errorMessages);
  }

  // Replace body with validated & sanitized data
  req.body = value;
  next();
};

export default validate;
