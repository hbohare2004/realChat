/**
 * Room Model
 * Defines the schema for chat rooms (direct and group conversations).
 */

import mongoose from "mongoose";
import { ROOM_TYPES } from "../utils/constants.js";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [100, "Room name cannot exceed 100 characters"],
      default: "",
    },
    type: {
      type: String,
      enum: Object.values(ROOM_TYPES),
      default: ROOM_TYPES.DIRECT,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Room creator is required"],
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Index: Fast lookup by participants ──────────────────────────────────────
roomSchema.index({ participants: 1 });
roomSchema.index({ updatedAt: -1 });

const Room = mongoose.model("Room", roomSchema);

export default Room;
