// ไฟล์: AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// กำหนด Type สำหรับ Context
interface AuthContextType {
    isLoggedIn: boolean;
    isLoggedIn: boolean;
    userEmail: string | null;
    login: (email: string) => void;
    logout: () => void;
}

// กำหนดค่าเริ่มต้น
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 1. ตรวจสอบสถานะการล็อกอินเริ่มต้นจาก Local Storage
    const [isLoading, setIsLoading] = useState(true); // 🚨 เริ่มต้นด้วย true
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // ตรวจสอบเมื่อ Component ถูก Mount ครั้งแรก
        const token = localStorage.getItem('userAuthToken');
        const email = localStorage.getItem('userEmail');
        
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
        // localStorage.setItem('userEmail', email); // Token ถูกเก็บใน google-button แล้ว
    };

    const logout = () => {
        // ลบข้อมูลทั้งหมด
        localStorage.removeItem('userAuthToken');
        localStorage.removeItem('userEmail');
        
        // อัปเดต State
        setIsLoggedIn(false);
        setUserEmail(null);

        // Optional: เคลียร์ Google Session
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    return (
        <AuthContext.Provider value={{ isLoading, isLoggedIn, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook สำหรับเรียกใช้ Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
