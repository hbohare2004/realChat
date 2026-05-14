/**
 * Application-wide configuration constants.
 * Reads from environment variables with sensible defaults.
 */

import dotenv from "dotenv";
dotenv.config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/realchat",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Cookie
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE, 10) || 7 * 24 * 60 * 60 * 1000, // 7 days
};

export default config;
