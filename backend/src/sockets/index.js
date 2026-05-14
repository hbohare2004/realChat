/**
 * Socket.io Initialization
 * Sets up the Socket.io server with authentication and event handlers.
 */

import { Server } from "socket.io";
import config from "../config/index.js";
import { authenticateSocket, handleConnection } from "./socketHandler.js";
import { SOCKET_EVENTS } from "../utils/constants.js";
import logger from "../utils/logger.js";

/**
 * Initialize Socket.io on the given HTTP server.
 * @param {import('http').Server} httpServer - Node HTTP server instance
 * @returns {import('socket.io').Server} Configured Socket.io server
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  // Handle new connections
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    handleConnection(io, socket);
  });

  logger.info("🔌 Socket.io initialized");

  return io;
};

export default initializeSocket;
