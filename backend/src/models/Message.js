/**
 * Message Model
 * Defines the schema for chat messages with support for different message types.
 */

import mongoose from "mongoose";
import { MESSAGE_TYPES } from "../utils/constants.js";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for room/group messages
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
      index: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    messageType: {
      type: String,
      enum: Object.values(MESSAGE_TYPES),
      default: MESSAGE_TYPES.TEXT,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Index: Efficient room message queries ──────────────────────────
messageSchema.index({ roomId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
