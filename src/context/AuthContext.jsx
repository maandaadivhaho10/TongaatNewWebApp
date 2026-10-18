import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import api, {
  setAccessToken,
} from "../API/axiosInstance";

import {
  connectChatSocket,
  disconnectChatSocket,
} from "../API/chatSocket";

// ======================================================
// AUTH CONTEXT
// ======================================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ====================================================
  // RESTORE SESSION
  // ====================================================

  const restoreSession = useCallback(async () => {
    try {
      const response = await api.post("/auth/refresh");

      const newToken = response.data.token;
      const restoredUser = response.data.user;

      if (!newToken || !restoredUser) {
        throw new Error("Invalid refresh response");
      }

      // Update Axios authentication
      setAccessToken(newToken);

      // Update React authentication state
      setToken(newToken);
      setUser(restoredUser);

    } catch (error) {
      console.error(
        "Session restoration failed:",
        error
      );

      setAccessToken(null);
      setToken(null);
      setUser(null);

    } finally {
      setLoading(false);
    }
  }, []);

  // ====================================================
  // RESTORE SESSION WHEN APPLICATION LOADS
  // ====================================================

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ====================================================
  // LOGIN
  // ====================================================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const {
      token: newToken,
      user: loggedInUser,
    } = response.data.data;

    if (!newToken || !loggedInUser) {
      throw new Error("Invalid login response");
    }

    // Update Axios authentication
    setAccessToken(newToken);

    // Update React authentication state
    setToken(newToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = async () => {
    try {
      await api.post("/auth/logout");

    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );

    } finally {
      // Clear Axios authentication
      setAccessToken(null);

      // Clear React authentication state
      setToken(null);
      setUser(null);
    }
  };

  // ====================================================
  // SOCKET.IO CONNECTION
  // ====================================================

  useEffect(() => {
    // Connect only when the user is authenticated.
    if (token && user) {
      connectChatSocket(token);
    } else {
      disconnectChatSocket();
    }

    // Disconnect when authentication changes
    // or AuthProvider unmounts.
    return () => {
      disconnectChatSocket();
    };

  }, [token, user]);

  // ====================================================
  // HANDLE AUTOMATIC TOKEN REFRESH
  // ====================================================

  useEffect(() => {
    const handleTokenRefreshed = (event) => {
      const newToken = event.detail?.token;
      const refreshedUser = event.detail?.user;

      if (!newToken) {
        return;
      }

      // Axios already updated its token.
      // Synchronize React state with the new token.
      setToken(newToken);

      // Update user only if the refresh response
      // includes user information.
      if (refreshedUser) {
        setUser(refreshedUser);
      }
    };

    // ==================================================
    // HANDLE EXPIRED SESSION
    // ==================================================

    const handleSessionExpired = () => {
      setAccessToken(null);
      setToken(null);
      setUser(null);

      disconnectChatSocket();
    };

    window.addEventListener(
      "auth:refreshed",
      handleTokenRefreshed
    );

    window.addEventListener(
      "auth:expired",
      handleSessionExpired
    );

    return () => {
      window.removeEventListener(
        "auth:refreshed",
        handleTokenRefreshed
      );

      window.removeEventListener(
        "auth:expired",
        handleSessionExpired
      );
    };
  }, []);

  // ====================================================
  // AUTH CONTEXT PROVIDER
  // ====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(user && token),
        login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// CUSTOM AUTH HOOK
// ======================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}