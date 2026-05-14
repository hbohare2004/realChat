/**
 * Message Service
 * Handles business logic for message operations.
 */

import Message from "../models/Message.js";
import Room from "../models/Room.js";
import ApiError from "../utils/ApiError.js";
import { PAGINATION } from "../utils/constants.js";

class MessageService {
  /**
   * Create and persist a new message.
   * Also updates the room's lastMessage reference.
   * @param {Object} messageData - { senderId, receiverId, roomId, message, messageType }
   * @returns {Object} Populated message document
   */
  static async createMessage({ senderId, receiverId, roomId, message, messageType }) {
    // Verify the room exists and the sender is a participant
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    const isParticipant = room.participants.some(
      (p) => p.toString() === senderId.toString()
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant of this room");
    }

    // Create the message
    const newMessage = await Message.create({
      senderId,
      receiverId: receiverId || null,
      roomId,
      message,
      messageType,
    });

    // Update room's lastMessage
    await Room.findByIdAndUpdate(roomId, { lastMessage: newMessage._id });

    // Return populated message
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "username avatar status")
      .populate("receiverId", "username avatar status");

    return populatedMessage;
  }

  /**
   * Get paginated messages for a specific room.
   * @param {string} roomId - Room's MongoDB ObjectId
   * @param {string} userId - Requesting user's ID (for authorization)
   * @param {Object} options - { page, limit }
   * @returns {Object} { messages, pagination }
   */
  static async getMessagesByRoom(roomId, userId, options = {}) {
    const page = parseInt(options.page, 10) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
      parseInt(options.limit, 10) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );
    const skip = (page - 1) * limit;

    // Verify the user is a participant of the room
    const room = await Room.findById(roomId);

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    const isParticipant = room.participants.some(
      (p) => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      throw new ApiError(403, "You are not a participant of this room");
    }

    // Fetch messages (newest first)
    const messages = await Message.find({ roomId })
      .populate("senderId", "username avatar status")
      .populate("receiverId", "username avatar status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ roomId });

    return {
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export default MessageService;
