/**
 * Application-wide constants.
 */

export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
};

export const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  SYSTEM: "system",
};

export const ROOM_TYPES = {
  DIRECT: "direct",
  GROUP: "group",
};

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  TYPING: "typing",
  STOP_TYPING: "stop-typing",
  USER_TYPING: "user-typing",
  USER_STOP_TYPING: "user-stop-typing",
  ONLINE_USERS: "online-users",
  USER_CONNECTED: "user-connected",
  USER_DISCONNECTED: "user-disconnected",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};
