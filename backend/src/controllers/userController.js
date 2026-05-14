/**
 * User Controller
 * Handles HTTP request/response for user operations.
 */

import UserService from "../services/userService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ─── Get All Users ───────────────────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserService.getAllUsers(req.user._id);

  res.status(200).json(new ApiResponse(200, { users }, "Users retrieved successfully"));
});

// ─── Get User By ID ──────────────────────────────────────────────────────────
export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.params.id);

  res.status(200).json(new ApiResponse(200, { user }, "User retrieved successfully"));
});
