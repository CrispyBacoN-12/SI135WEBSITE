"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "./component/Authcontext";

interface CredentialResponse {
  credential: string;
  select_by: string;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const BACKEND_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL as string) + "/api/auth/google";

const GoogleLoginButton = () => {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) router.replace("/dashboard");
  }, [isLoggedIn, router]);

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      setIsLoading(true);
      setLoginError(null);

      try {
        const res = await axios.post(BACKEND_URL, {
          id_token: response.credential,
        });

        const { token, email } = res.data;

        if (!token || !email) throw new Error("Invalid server response");

        localStorage.setItem("userAuthToken", token);
        localStorage.setItem("userEmail", email);

        login(email);
      } catch (error) {
        const msg = axios.isAxiosError(error)
          ? error.response?.data?.error || "Login failed"
          : "Unexpected error";
        setLoginError(msg);
        setIsLoading(false);
      }
    },
    [login]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    // โหลด Google Identity script ถ้ายังไม่มี
    const existing = document.getElementById("google-identity");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-identity";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          // ใส่ไว้ช่วย “ชี้” ไปโดเมนมหาลัย (ไม่ใช่ security ต้องเช็คที่ backend)
          // hosted_domain: "youruni.edu",
        });
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "filled_blue", size: "large", width: "280", text: "signin_with" }
        );
      };
      document.body.appendChild(script);
    } else {
      // ถ้ามี script อยู่แล้ว
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "filled_blue", size: "large", width: "280", text: "signin_with" }
      );
    }
  }, [handleCredentialResponse]);

  if (isLoggedIn) return <p>กำลังเปลี่ยนหน้า...</p>;

  return (
    <div className="login-container card">
      <h3>ล็อกอินด้วยบัญชีมหาวิทยาลัย</h3>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      {isLoading && <p>กำลังตรวจสอบ...</p>}
      <div id="signInDiv" style={{ opacity: isLoading ? 0.5 : 1 }} />
    </div>
  );
};

export default GoogleLoginButton;
