"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

interface CredentialResponse {
  credential: string;
  select_by: string;
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
const BACKEND_URL = base + "/api/auth/google";

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
  if (!GOOGLE_CLIENT_ID) {
    console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
    return;
  }

  const init = () => {
    const el = document.getElementById("signInDiv");
    if (!el) return;

    // กัน render ซ้ำ (Google จะยัด iframe ซ้อน)
    el.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(el, {
      theme: "filled_blue",
      size: "large",
      width: "280",
      text: "signin_with",
    });
  };

  // ถ้า script โหลดแล้ว
  if (window.google?.accounts?.id) {
    init();
    return;
  }

  // ถ้ายังไม่โหลด ให้ inject script แล้วรอ
  const existing = document.getElementById("google-identity") as HTMLScriptElement | null;
  if (!existing) {
    const script = document.createElement("script");
    script.id = "google-identity";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    script.onerror = () => console.error("Failed to load Google Identity script");
    document.body.appendChild(script);
  } else {
    // มี script แต่ยังไม่พร้อม -> รอด้วย polling สั้น ๆ
    const t = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(t);
        init();
      }
    }, 200);
    return () => clearInterval(t);
  }
}, [handleCredentialResponse, isLoggedIn]);

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
