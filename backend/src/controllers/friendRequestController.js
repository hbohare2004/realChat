/**
 * Friend Request Controller
 * Handles HTTP request/response for friend requests.
 */

import FriendRequestService from "../services/friendRequestService.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId } = req.body;
  const request = await FriendRequestService.sendRequest(req.user._id, recipientId);

  res.status(201).json(new ApiResponse(201, { request }, "Request sent successfully"));
});

export const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await FriendRequestService.getPendingRequests(req.user._id);

  res.status(200).json(new ApiResponse(200, { requests }, "Requests retrieved successfully"));
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await FriendRequestService.updateRequestStatus(requestId, req.user._id, status);

  res.status(200).json(new ApiResponse(200, { request }, `Request ${status} successfully`));
});
