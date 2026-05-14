/**
 * Message Routes
 * POST /api/messages          - Send a message
 * GET  /api/messages/:roomId  - Get messages by room
 */

import { Router } from "express";
import { sendMessage, getMessagesByRoom } from "../controllers/messageController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { sendMessageSchema } from "../validators/messageValidator.js";

const router = Router();

router.post("/", auth, validate(sendMessageSchema), sendMessage);
router.get("/:roomId", auth, getMessagesByRoom);

export default router;
