/**
 * Room Validation Schema
 * Joi schema for creating chat rooms.
 */

import Joi from "joi";
import { ROOM_TYPES } from "../utils/constants.js";

export const createRoomSchema = Joi.object({
  name: Joi.string().trim().max(100).optional().allow("").messages({
    "string.max": "Room name cannot exceed 100 characters",
  }),
  type: Joi.string()
    .valid(...Object.values(ROOM_TYPES))
    .default(ROOM_TYPES.DIRECT)
    .messages({
      "any.only": `Room type must be one of: ${Object.values(ROOM_TYPES).join(", ")}`,
    }),
  participants: Joi.array()
    .items(
      Joi.string().hex().length(24).messages({
        "string.hex": "Participant ID must be a valid ObjectId",
        "string.length": "Participant ID must be 24 characters",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one participant is required",
      "any.required": "Participants list is required",
    }),
});
