/**
 * Friend Request Service
 * Handles business logic for friend requests and chat invitations.
 */

import FriendRequest from "../models/FriendRequest.js";
import RoomService from "./roomService.js";
import ApiError from "../utils/ApiError.js";
import { ROOM_TYPES } from "../utils/constants.js";

class FriendRequestService {
  /**
   * Send a friend request.
   */
  static async sendRequest(senderId, recipientId) {
    if (senderId.toString() === recipientId.toString()) {
      throw new ApiError(400, "You cannot send a request to yourself");
    }

    // Check if a pending request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    if (existingRequest) {
      throw new ApiError(400, "A pending request already exists for this user");
    }

    const request = await FriendRequest.create({
      sender: senderId,
      recipient: recipientId,
    });

    return request;
  }

  /**
   * Get pending requests for the current user.
   */
  static async getPendingRequests(userId) {
    return await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "username avatar");
  }

  /**
   * Update request status (Accept/Reject).
   */
  static async updateRequestStatus(requestId, userId, status) {
    const request = await FriendRequest.findOne({
      _id: requestId,
      recipient: userId,
    });

    if (!request) {
      throw new ApiError(404, "Request not found");
    }

    if (request.status !== "pending") {
      throw new ApiError(400, "Request has already been processed");
    }

    request.status = status;
    await request.save();

    // If accepted, create a chat room
    if (status === "accepted") {
      await RoomService.createRoom({
        type: ROOM_TYPES.DIRECT,
        participants: [request.sender.toString()],
        createdBy: userId.toString(),
      });
    }

    return request;
  }
}

export default FriendRequestService;
