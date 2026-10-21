
import api from "./axiosInstance";

// ======================================================
// CHAT API SERVICE
// ======================================================

// ======================================================
// 1. CREATE CHAT CONVERSATION (LEGACY)
// POST /api/chat/conversations
// Kept for compatibility with existing code.
// Not needed by the new supplier chat screen.
// ======================================================

export const createChatConversation = async (subject) => {
  try {
    const response = await api.post(
      "/chat/conversations",
      { subject }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create chat conversation error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// 2. GET CHAT CONVERSATIONS
// GET /api/chat/conversations
//
// Role 1: Supplier's existing conversations
// Role 2: ED Team shared inbox
// ======================================================

export const getChatConversations = async () => {
  try {
    const response = await api.get(
      "/chat/conversations"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get chat conversations error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// 3. GET MESSAGES FOR A SPECIFIC CONVERSATION
// GET /api/chat/conversations/:conversationId/messages
// Mainly used by the ED Team to view supplier chats.
// ======================================================

export const getChatMessages = async (conversationId) => {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const response = await api.get(
      `/chat/conversations/${conversationId}/messages`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get chat messages error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// 4. SEND MESSAGE TO A SPECIFIC CONVERSATION
// POST /api/chat/conversations/:conversationId/messages
// Used by ED Team to reply to a selected supplier.
// ======================================================

export const sendChatMessage = async (
  conversationId,
  message
) => {
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      throw new Error("Message cannot be empty");
    }

    const response = await api.post(
      `/chat/conversations/${conversationId}/messages`,
      {
        message: message.trim(),
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Send chat message error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// 5. GET DIRECT SUPPORT CHAT - SUPPLIER ONLY
// GET /api/chat/direct
//
// Loads the supplier's messages with the ED Team.
// No conversation ID or subject is required.
// ======================================================

export const getDirectChat = async () => {
  try {
    const response = await api.get("/chat/direct");

    return response.data;
  } catch (error) {
    console.error(
      "Get direct support chat error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ======================================================
// 6. SEND DIRECT MESSAGE - SUPPLIER ONLY
// POST /api/chat/direct/messages
//
// Automatically creates the support conversation
// when the supplier sends their first message.
// Future messages reuse that conversation.
// ======================================================

export const sendDirectChatMessage = async (message) => {
  try {
    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      throw new Error("Message cannot be empty");
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length > 5000) {
      throw new Error(
        "Message cannot exceed 5000 characters"
      );
    }

    const response = await api.post(
      "/chat/direct/messages",
      {
        message: cleanMessage,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Send direct support message error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

 // ======================================================

export const openSupplierConversation = async (supplierUserId) => {
  try {
    const id = Number(supplierUserId);

    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new Error("Valid supplier user ID is required");
    }

    const response = await api.post(
      "/chat/conversations/direct",
      {
        supplier_user_id: id,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Open supplier conversation error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ======================================================
// EXPORT ALL CHAT API FUNCTIONS
// ======================================================

const chatApi = {
  createChatConversation,
  getChatConversations,
  getChatMessages,
  sendChatMessage,
  getDirectChat,
  sendDirectChatMessage,openSupplierConversation
};

export default chatApi;
