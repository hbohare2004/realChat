/**
 * Message Controller
 * Handles HTTP request/response for message operations.
 */

import MessageService from "../services/messageService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ─── Send Message ────────────────────────────────────────────────────────────
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, roomId, message, messageType } = req.body;

  const newMessage = await MessageService.createMessage({
    senderId: req.user._id,
    receiverId,
    roomId,
    message,
    messageType,
  });

  res.status(201).json(new ApiResponse(201, { message: newMessage }, "Message sent successfully"));
});

// ─── Get Messages By Room ────────────────────────────────────────────────────
export const getMessagesByRoom = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { page, limit } = req.query;

  const result = await MessageService.getMessagesByRoom(roomId, req.user._id, {
    page,
    limit,
  });

  res.status(200).json(
    new ApiResponse(200, result, "Messages retrieved successfully")
  );
});
