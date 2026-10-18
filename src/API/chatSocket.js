import { io } from "socket.io-client";

// ======================================================
// SOCKET.IO CONFIGURATION
// ======================================================

const SOCKET_URL = "http://localhost:5000";

export const chatSocket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// ======================================================
// CONNECT SOCKET USING JWT ACCESS TOKEN
// ======================================================

export const connectChatSocket = (token) => {
  if (!token) {
    console.warn(
      "Socket connection failed: Access token missing"
    );
    return;
  }

  // Avoid reconnecting if already connected
  // with the same token.
  if (
    chatSocket.connected &&
    chatSocket.auth?.token === token
  ) {
    return;
  }

  // Update the JWT for socket authentication.
  chatSocket.auth = { token };

  // Disconnect an existing connection if the token changed.
  if (chatSocket.connected) {
    chatSocket.disconnect();
  }

  // Establish the connection.
  chatSocket.connect();
};

// ======================================================
// DISCONNECT SOCKET
// ======================================================

export const disconnectChatSocket = () => {
  chatSocket.disconnect();

  // Clear authentication information.
  chatSocket.auth = {};
};

// ======================================================
// SOCKET CONNECTION EVENTS
// ======================================================

chatSocket.on("connect", () => {
  console.log(
    "Socket.IO connected successfully:",
    chatSocket.id
  );
});

chatSocket.on("connect_error", (error) => {
  console.error(
    "Socket.IO connection error:",
    error.message
  );
});

chatSocket.on("disconnect", (reason) => {
  console.log(
    "Socket.IO disconnected:",
    reason
  );
});