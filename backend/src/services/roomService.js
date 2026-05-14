/**
 * Room Service
 * Handles business logic for chat room operations.
 */

import Room from "../models/Room.js";
import ApiError from "../utils/ApiError.js";
import { ROOM_TYPES } from "../utils/constants.js";

class RoomService {
  /**
   * Create a new chat room.
   * For direct rooms, checks if a room already exists between the two users.
   * @param {Object} roomData - { name, type, participants, createdBy }
   * @returns {Object} Populated room document
   */
  static async createRoom({ name, type, participants, createdBy }) {
    // Ensure the creator is included in participants
    const allParticipants = [...new Set([createdBy, ...participants])];

    // For direct messages, check if a room already exists between the two users
    if (type === ROOM_TYPES.DIRECT && allParticipants.length === 2) {
      const existingRoom = await Room.findOne({
        type: ROOM_TYPES.DIRECT,
        participants: { $all: allParticipants, $size: 2 },
      })
        .populate("participants", "username avatar status lastSeen")
        .populate("lastMessage");

      if (existingRoom) {
        return existingRoom;
      }
    }

    // Validate group rooms have a name
    if (type === ROOM_TYPES.GROUP && !name) {
      throw new ApiError(400, "Group rooms must have a name");
    }

    // Create the room
    const room = await Room.create({
      name: name || "",
      type,
      participants: allParticipants,
      createdBy,
    });

    // Return populated room
    const populatedRoom = await Room.findById(room._id)
      .populate("participants", "username avatar status lastSeen")
      .populate("lastMessage");

    return populatedRoom;
  }

  /**
   * Get all rooms the user is a participant of.
   * @param {string} userId - User's MongoDB ObjectId
   * @returns {Array} List of populated room documents
   */
  static async getUserRooms(userId) {
    const rooms = await Room.find({ participants: userId })
      .populate("participants", "username avatar status lastSeen")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "username avatar",
        },
      })
      .sort({ updatedAt: -1 });

    return rooms;
  }

  /**
   * Get a room by ID.
   * @param {string} roomId - Room's MongoDB ObjectId
   * @returns {Object} Populated room document
   */
  static async getRoomById(roomId) {
    const room = await Room.findById(roomId)
      .populate("participants", "username avatar status lastSeen")
      .populate("lastMessage");

    if (!room) {
      throw new ApiError(404, "Room not found");
    }

    return room;
  }
}

export default RoomService;
