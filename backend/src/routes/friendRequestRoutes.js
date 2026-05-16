/**
 * Friend Request Routes
 * POST /api/requests          - Send a request
 * GET  /api/requests/pending  - Get pending requests
 * PATCH /api/requests/:requestId - Accept/Reject request
 */

import { Router } from "express";
import { sendRequest, getPendingRequests, updateRequestStatus } from "../controllers/friendRequestController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/", auth, sendRequest);
router.get("/pending", auth, getPendingRequests);
router.patch("/:requestId", auth, updateRequestStatus);

export default router;
