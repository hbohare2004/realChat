/**
 * Room Routes
 * POST /api/rooms - Create a chat room
 * GET  /api/rooms - Get user's rooms
 */

import { Router } from "express";
import { createRoom, getUserRooms } from "../controllers/roomController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createRoomSchema } from "../validators/roomValidator.js";

const router = Router();

router.post("/", auth, validate(createRoomSchema), createRoom);
router.get("/", auth, getUserRooms);

export default router;
