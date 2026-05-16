/**
 * Server Entry Point
 * Creates HTTP server, initializes Socket.io, connects to MongoDB,
 * and starts listening for connections.
 */

import { createServer } from "http";
import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./config/db.js";
import initializeSocket from "./sockets/index.js";
import logger from "./utils/logger.js";

// Create HTTP server from Express app
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSocket(httpServer);

// Make io accessible to the rest of the app if needed
app.set("io", io);

/**
 * Start the server after establishing database connection.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    httpServer.listen(config.port, () => {
      logger.info(`
╔══════════════════════════════════════════════╗
║                                              ║
║   🚀 RealChat Server is running!             ║
║                                              ║
║   🌐 HTTP:   http://localhost:${config.port}          ║
║   🔌 Socket: ws://localhost:${config.port}            ║
║   📦 Env:    ${config.nodeEnv.padEnd(30)}║
║                                              ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const gracefulShutdown = (signal) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);

  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle unhandled rejections
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error.message);
  process.exit(1);
});

// Start!
startServer();
 
