import Script from "next/script";
import LoginClient from "../components/login"; // component ปุ่มของคุณ

export default function LoginPage() {
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <LoginClient />
    </>
  );
}

