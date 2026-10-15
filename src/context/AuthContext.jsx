
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

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const response = await api.post("/auth/refresh");

      const newToken = response.data.token;
      const restoredUser = response.data.user;

      if (!newToken || !restoredUser) {
        throw new Error("Invalid refresh response");
      }

      setAccessToken(newToken);
      setToken(newToken);
      setUser(restoredUser);
    } catch (error) {
      console.error("Session restoration failed:", error);

      setAccessToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token: newToken, user: loggedInUser } =
      response.data.data;

    setAccessToken(newToken);
    setToken(newToken);
    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setAccessToken(null);
      setToken(null);
      setUser(null);
    }
  };

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

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
