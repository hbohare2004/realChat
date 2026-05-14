/**
 * Message Validation Schema
 * Joi schema for sending messages.
 */

import Joi from "joi";
import { MESSAGE_TYPES } from "../utils/constants.js";

export const sendMessageSchema = Joi.object({
  receiverId: Joi.string().hex().length(24).optional().allow(null).messages({
    "string.hex": "Receiver ID must be a valid ObjectId",
    "string.length": "Receiver ID must be 24 characters",
  }),
  roomId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Room ID must be a valid ObjectId",
    "string.length": "Room ID must be 24 characters",
    "any.required": "Room ID is required",
  }),
  message: Joi.string().trim().min(1).max(5000).required().messages({
    "string.min": "Message cannot be empty",
    "string.max": "Message cannot exceed 5000 characters",
    "any.required": "Message content is required",
  }),
  messageType: Joi.string()
    .valid(...Object.values(MESSAGE_TYPES))
    .default(MESSAGE_TYPES.TEXT)
    .messages({
      "any.only": `Message type must be one of: ${Object.values(MESSAGE_TYPES).join(", ")}`,
    }),
});
