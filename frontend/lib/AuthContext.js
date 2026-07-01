"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("yoto_token");
    const storedUser = localStorage.getItem("yoto_user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function saveAuth(userData, tokenStr) {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem("yoto_token", tokenStr);
    localStorage.setItem("yoto_user", JSON.stringify(userData));
  }

  function clearAuth() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("yoto_token");
    localStorage.removeItem("yoto_user");
  }

  async function loginUser(email, password) {
    const data = await apiLogin({ email, password });
    saveAuth(data.user, data.token);
    return data;
  }

  async function registerUser(name, email, password) {
    const data = await apiRegister({ name, email, password });
    saveAuth(data.user, data.token);
    return data;
  }

  function updateUserState(userData) {
    saveAuth(userData, token);
  }

  function logout() {
    clearAuth();
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login: loginUser, register: registerUser, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
