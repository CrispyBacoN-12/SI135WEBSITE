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
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // ✅ อ่านจาก sessionStorage (ปิดเว็บแล้วหาย)
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

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    sessionStorage.removeItem("userAuthToken");
    sessionStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    setUserEmail(null);

    const g = (window as any).google;
    if (g?.accounts?.id) g.accounts.id.disableAutoSelect();
  };

  // ✅ (ไม่บังคับ) ล้าง session ตอนปิดแท็บ/ปิดเว็บ
  useEffect(() => {
    const clearSession = () => {
      localStorage.removeItem("userAuthToken");
      localStorage.removeItem("userEmail");
    };

    window.addEventListener("beforeunload", clearSession);
    return () => window.removeEventListener("beforeunload", clearSession);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
