/**
 * Authentication Service
 * Handles business logic for user registration, login, and token management.
 */

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";

class AuthService {
  /**
   * Generate a JWT token for a given user ID.
   * @param {string} id - User's MongoDB ObjectId
   * @returns {string} Signed JWT token
   */
  static generateToken(id) {
    return jwt.sign({ id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }

  /**
   * Set JWT token as an HTTP-only cookie on the response.
   * @param {import('express').Response} res - Express response object
   * @param {string} token - JWT token
   */
  static setTokenCookie(res, token) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
      maxAge: config.cookieMaxAge,
    });
  }

  /**
   * Clear the authentication cookie.
   * @param {import('express').Response} res - Express response object
   */
  static clearTokenCookie(res) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: config.nodeEnv === "production" ? "none" : "lax",
      maxAge: 0,
    });
  }

  /**
   * Register a new user.
   * @param {Object} userData - { username, email, password, avatar }
   * @returns {Object} { user, token }
   */
  static async register({ username, email, password, avatar }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "An account with this email already exists");
      }
      throw new ApiError(409, "This username is already taken");
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      avatar: avatar || "",
    });

    const token = AuthService.generateToken(user._id);

    return { user, token };
  }

  /**
   * Authenticate user with email and password.
   * @param {Object} credentials - { email, password }
   * @returns {Object} { user, token }
   */
  static async login({ email, password }) {
    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Update user status to online
    user.status = "online";
    user.lastSeen = new Date();
    await user.save();

    const token = AuthService.generateToken(user._id);

    return { user, token };
  }

  /**
   * Get current authenticated user by ID.
   * @param {string} userId - User's MongoDB ObjectId
   * @returns {Object} User document
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}

export default AuthService;
