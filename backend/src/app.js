/**
 * Express Application Setup
 * Configures middleware, routes, and error handling.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import config from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS Configuration ─────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ─── HTTP Request Logging ────────────────────────────────────────────────────
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Health Check Endpoint ───────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "RealChat API is running 🚀",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
