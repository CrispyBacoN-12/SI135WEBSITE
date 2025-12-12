import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface CredentialResponse {
  credential: string;
  select_by: string;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_URL = "http://localhost:3000/api/auth/google";
const ALLOWED_DOMAIN = "student.mahidol.edu";

export default function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const { data } = await axios.post(
        BACKEND_URL,
        { token: response.credential },
        { withCredentials: true }
      );

      const email: string | undefined = data?.email;

      if (!email?.toLowerCase().endsWith(`@${ALLOWED_DOMAIN}`)) {
        throw new Error("Only Mahidol student email allowed");
      }

      // ถ้า backend ส่ง JWT กลับมา (ไม่แนะนำเก็บ localStorage ถ้ามีข้อมูลสำคัญ)
      // localStorage.setItem("userAuthToken", data.authToken);

      window.location.href = "/dashboard";
    } catch (e: any) {
      setLoginError(e?.response?.data?.error || e?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const w = window as any;
    if (!w.google || !GOOGLE_CLIENT_ID) return;

    w.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    w.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "filled_blue", size: "large", width: "280", text: "signin_with" }
    );
  }, [handleCredentialResponse]);

  return (
    <div>
      <h3>Login ด้วย Google (ต้องเป็น @student.mahidol.edu)</h3>
      {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      {isLoading && <p>กำลังตรวจสอบ...</p>}
      <div id="signInDiv" style={{ opacity: isLoading ? 0.5 : 1 }} />
    </div>
  );
}
