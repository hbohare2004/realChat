/**
 * Authentication Routes
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Login user
 * POST /api/auth/logout   - Logout user
 * GET  /api/auth/me       - Get current authenticated user
 */

import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);

export default router;
