/**
 * User Service
 * Handles business logic for user-related operations.
 */

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class UserService {
  /**
   * Get all users (excluding the requesting user).
   * @param {string} currentUserId - The authenticated user's ID to exclude
   * @returns {Array} List of user documents
   */
  static async getAllUsers(currentUserId) {
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-__v")
      .sort({ username: 1 });

    return users;
  }

  /**
   * Get a single user by ID.
   * @param {string} userId - Target user's MongoDB ObjectId
   * @returns {Object} User document
   */
  static async getUserById(userId) {
    const user = await User.findById(userId).select("-__v");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  /**
   * Update user's online status.
   * @param {string} userId - User's MongoDB ObjectId
   * @param {string} status - "online" or "offline"
   */
  static async updateUserStatus(userId, status) {
    await User.findByIdAndUpdate(userId, {
      status,
      lastSeen: new Date(),
    });
  }

  /**
   * Search users by username (excluding the requesting user).
   * @param {string} query - Search string
   * @param {string} currentUserId - The authenticated user's ID to exclude
   * @returns {Array} List of matching user documents
   */
  static async searchUsers(query, currentUserId) {
    if (!query || query.trim() === "") return [];

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        {
          username: { $regex: query, $options: "i" },
        },
      ],
    })
      .select("username avatar status")
      .limit(10);

    return users;
  }
}

export default UserService;
