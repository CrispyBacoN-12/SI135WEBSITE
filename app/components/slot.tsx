"use client";
import { useState, useEffect, useRef } from "react";

const symbols = ["🍒", "🍋", "🍉", "⭐", "💎", "7️⃣"];

export default function SlotMachine() {
  const [slots, setSlots] = useState(["❓", "❓", "❓"]);
  const [result, setResult] = useState("");
  const [spinning, setSpinning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const spin = () => {
    if (spinning) return; // 🔒 ป้องกัน spam

    setSpinning(true);
    setResult("");

    audioRef.current?.play(); // 🔊 เล่นเสียงหมุน

    // 🔄 อนิเมชันแบบสุ่มหลายรอบก่อนหยุดจริง
    const totalSpinFrames = 10;
    let count = 0;

    const interval = setInterval(() => {
      const tempSlots = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setSlots(tempSlots);
      count++;

      if (count >= totalSpinFrames) {
        clearInterval(interval);

        // 🟢 สุ่มสุดท้าย
        const finalSlots = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];
        setSlots(finalSlots);

        if (finalSlots.every((s) => s === finalSlots[0])) {
          setResult("🎉 แจ็คพอต! ได้เหมือนกันทั้ง 3 ช่อง!");
        } else if (new Set(finalSlots).size === 2) {
          setResult("✨ ได้เหมือนกัน 2 ช่อง!");
        } else {
          setResult("😢 ดวงยังไม่มา ลองใหม่อีกที!");
        }

        setSpinning(false); // ปลดล็อกปุ่ม
      }
    }, 100); // ความเร็วแสดงผลหมุน
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">🎰 สล็อตเสี่ยงดวง</h2>

      <div
        className={`flex justify-center text-6xl space-x-4 mb-4 transition-transform duration-200 ${
          spinning ? "animate-pulse" : ""
        }`}
      >
        {slots.map((s, i) => (
          <span
            key={i}
            className={`transition-all duration-300 ${
              spinning ? "animate-bounce" : ""
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`${
          spinning ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        } bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-2 rounded-full font-semibold shadow transition`}
      >
        {spinning ? "หมุนกำลังทำงาน..." : "หมุน!"}
      </button>

      {result && <p className="mt-4 text-lg font-medium">{result}</p>}

      {/* 🔊 เสียงหมุน */}
      <audio ref={audioRef} src="/sounds/spin.mp3" preload="auto" />
    </div>
  );
}
