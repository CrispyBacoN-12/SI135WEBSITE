"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ อ่านจาก localStorage (ปิดแท็บ/ปิดเว็บแล้วยังอยู่)
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, token: string) => {
    localStorage.setItem("userAuthToken", token);
    localStorage.setItem("userEmail", email);

    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("userAuthToken");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setUserEmail(null);

    const g = (window as any).google;
    if (g?.accounts?.id) g.accounts.id.disableAutoSelect();
  };

  return (
    <AuthContext.Provider
      value={{ isLoading, isLoggedIn, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
