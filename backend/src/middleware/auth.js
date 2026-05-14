/**
 * Authentication Middleware
 * Verifies JWT tokens from cookies or Authorization header.
 * Attaches the authenticated user to req.user.
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "./asyncHandler.js";
import config from "../config/index.js";

const auth = asyncHandler(async (req, _res, next) => {
  let token;

  // 1. Check for token in cookies
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // 2. Fallback: Check Authorization header (Bearer <token>)
  else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Authentication required. Please log in.");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User associated with this token no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, "Invalid or expired token. Please log in again.");
  }
});

export default auth;
