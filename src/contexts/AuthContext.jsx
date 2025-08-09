import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);
      const data = response.data;

      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 401) {
        return { success: false, message: "Invalid email or password" };
      }
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken("");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
