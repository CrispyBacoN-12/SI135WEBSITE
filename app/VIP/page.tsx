"use client";
import { useState } from "react";
import SlotMachine from "../components/slot";

export default function SlotPage() {
  const [showPopup, setShowPopup] = useState(true);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const password = "135slot"; // 🔐 เปลี่ยนรหัสได้ที่นี่

  const handleSubmit = () => {
    if (input === password) {
      setShowPopup(false); // ✅ ปิด popup
      setError("");
    } else {
      setError("❌ รหัสไม่ถูกต้อง ลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Slot Machine */}
      <SlotMachine />

      {/* 🔒 POP-UP ป้อนรหัส */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">🔐 ป้อนรหัสผ่านก่อนใช้งาน</h2>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border px-3 py-2 w-full rounded mb-3"
              placeholder="รหัสผ่าน"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
