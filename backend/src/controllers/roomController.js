/**
 * Room Controller
 * Handles HTTP request/response for room operations.
 */

import RoomService from "../services/roomService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ─── Create Room ─────────────────────────────────────────────────────────────
export const createRoom = asyncHandler(async (req, res) => {
  const { name, type, participants } = req.body;

  const room = await RoomService.createRoom({
    name,
    type,
    participants,
    createdBy: req.user._id.toString(),
  });

  res.status(201).json(new ApiResponse(201, { room }, "Room created successfully"));
});

// ─── Get User's Rooms ────────────────────────────────────────────────────────
export const getUserRooms = asyncHandler(async (req, res) => {
  const rooms = await RoomService.getUserRooms(req.user._id);

  res.status(200).json(new ApiResponse(200, { rooms }, "Rooms retrieved successfully"));
});
