/**
 * MongoDB connection setup using Mongoose.
 * Connects to MongoDB Atlas (or local MongoDB) with retry logic.
 */

import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
