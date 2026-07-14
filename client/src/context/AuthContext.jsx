import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = localStorage.getItem("oruaka_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getMe();
      setUser(data.user);
      setWorkerProfile(data.workerProfile);
    } catch (err) {
      localStorage.removeItem("oruaka_access_token");
      localStorage.removeItem("oruaka_refresh_token");
      setUser(null);
      setWorkerProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
    const handleLogout = () => {
      setUser(null);
      setWorkerProfile(null);
    };
    window.addEventListener("oruaka:logout", handleLogout);
    return () => window.removeEventListener("oruaka:logout", handleLogout);
  }, [loadSession]);

  function persistSession({ user: u, accessToken, refreshToken }) {
    localStorage.setItem("oruaka_access_token", accessToken);
    localStorage.setItem("oruaka_refresh_token", refreshToken);
    setUser(u);
  }

  async function signup(payload) {
    const { data } = await authApi.signup(payload);
    persistSession(data);
    return data;
  }

  async function login(payload) {
    const { data } = await authApi.login(payload);
    persistSession(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("oruaka_access_token");
    localStorage.removeItem("oruaka_refresh_token");
    setUser(null);
    setWorkerProfile(null);
  }

  const value = {
    user,
    workerProfile,
    setWorkerProfile,
    isLoading,
    isAuthenticated: Boolean(user),
    signup,
    login,
    logout,
    refreshSession: loadSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
