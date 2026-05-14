/**
 * Authentication Controller
 * Handles HTTP request/response for auth operations.
 */

import AuthService from "../services/authService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ─── Register ────────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { username, email, password, avatar } = req.body;

  const { user, token } = await AuthService.register({
    username,
    email,
    password,
    avatar,
  });

  // Set token cookie
  AuthService.setTokenCookie(res, token);

  res.status(201).json(new ApiResponse(201, { user, token }, "User registered successfully"));
});

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await AuthService.login({ email, password });

  // Set token cookie
  AuthService.setTokenCookie(res, token);

  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});

// ─── Logout ──────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (_req, res) => {
  AuthService.clearTokenCookie(res);

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// ─── Get Current User ────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getCurrentUser(req.user._id);

  res.status(200).json(new ApiResponse(200, { user }, "Current user retrieved successfully"));
});
