/**
 * User Routes
 * GET /api/users     - Get all users
 * GET /api/users/:id - Get user by ID
 */

import { Router } from "express";
import { getAllUsers, getUserById, searchUsers } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", auth, getAllUsers);
router.get("/search", auth, searchUsers);
router.get("/:id", auth, getUserById);

export default router;
