/**
 * Route Index
 * Aggregates all route modules and mounts them under /api.
 */

import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import messageRoutes from "./messageRoutes.js";
import roomRoutes from "./roomRoutes.js";
import friendRequestRoutes from "./friendRequestRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/messages", messageRoutes);
router.use("/rooms", roomRoutes);
router.use("/requests", friendRequestRoutes);

export default router;
