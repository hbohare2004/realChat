/**
 * Socket.io Event Handlers
 * Modular handlers for real-time chat events.
 */

import jwt from "jsonwebtoken";
import config from "../config/index.js";
import MessageService from "../services/messageService.js";
import UserService from "../services/userService.js";
import { SOCKET_EVENTS, USER_STATUS } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * In-memory store for tracking online users.
 * Maps userId → Set of socket IDs (supports multiple tabs/devices).
 */
const onlineUsers = new Map();

/**
 * Get list of currently online user IDs.
 * @returns {string[]}
 */
const getOnlineUserIds = () => Array.from(onlineUsers.keys());

/**
 * Authenticate socket connections using JWT from handshake.
 * @param {import('socket.io').Socket} socket
 * @param {Function} next
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie
        ?.split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
};

/**
 * Handle a new socket connection.
 * @param {import('socket.io').Server} io - Socket.io server instance
 * @param {import('socket.io').Socket} socket - Connected socket
 */
const handleConnection = (io, socket) => {
  const userId = socket.userId;
  logger.info(`⚡ User connected: ${userId} (socket: ${socket.id})`);

  // ─── Track Online User ───────────────────────────────────────────
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socket.id);

  // Update user status in DB
  UserService.updateUserStatus(userId, USER_STATUS.ONLINE).catch((err) =>
    logger.error("Failed to update user status:", err.message)
  );

  // Broadcast online users to all clients
  io.emit(SOCKET_EVENTS.ONLINE_USERS, getOnlineUserIds());

  // Notify others that user connected
  socket.broadcast.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

  // ─── Join Room ───────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId }) => {
    if (!roomId) return;

    socket.join(roomId);
    logger.debug(`User ${userId} joined room ${roomId}`);
  });

  // ─── Leave Room ──────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId }) => {
    if (!roomId) return;

    socket.leave(roomId);
    logger.debug(`User ${userId} left room ${roomId}`);
  });

  // ─── Send Message ────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data) => {
    try {
      const { roomId, receiverId, message, messageType } = data;

      if (!roomId || !message) {
        socket.emit("error", { message: "Room ID and message are required" });
        return;
      }

      // Persist message to database
      const newMessage = await MessageService.createMessage({
        senderId: userId,
        receiverId: receiverId || null,
        roomId,
        message,
        messageType: messageType || "text",
      });

      // Broadcast message to the room
      io.to(roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, newMessage);

      logger.debug(`Message sent by ${userId} in room ${roomId}`);
    } catch (error) {
      logger.error("Socket send-message error:", error.message);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // ─── Typing Indicator ───────────────────────────────────────────
  socket.on(SOCKET_EVENTS.TYPING, ({ roomId }) => {
    if (!roomId) return;

    socket.to(roomId).emit(SOCKET_EVENTS.USER_TYPING, { userId, roomId });
  });

  // ─── Stop Typing ────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.STOP_TYPING, ({ roomId }) => {
    if (!roomId) return;

    socket.to(roomId).emit(SOCKET_EVENTS.USER_STOP_TYPING, { userId, roomId });
  });

  // ─── Disconnect ──────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    logger.info(`🔌 User disconnected: ${userId} (socket: ${socket.id})`);

    // Remove socket from user's set
    const userSockets = onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);

      // If no more sockets, user is fully offline
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);

        // Update user status in DB
        UserService.updateUserStatus(userId, USER_STATUS.OFFLINE).catch((err) =>
          logger.error("Failed to update user status:", err.message)
        );

        // Notify others
        socket.broadcast.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId });
      }
    }

    // Broadcast updated online users
    io.emit(SOCKET_EVENTS.ONLINE_USERS, getOnlineUserIds());
  });
};

export { authenticateSocket, handleConnection, getOnlineUserIds };
