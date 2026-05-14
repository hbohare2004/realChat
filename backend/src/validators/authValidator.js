/**
 * Authentication Validation Schemas
 * Joi schemas for register and login request bodies.
 */

import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 128 characters",
    "any.required": "Password is required",
  }),
  avatar: Joi.string().uri().optional().allow(""),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
