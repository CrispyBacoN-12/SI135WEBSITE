// SectionCard.js
"use client";
import React, { useState } from "react";
import LectureCard from "./AcademicComponent"; // ใช้ LectureCard จาก AcademicComponent


export default function SectionCard({ name, lectures }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
    <div className=" w-full bg-gradient-to-r from-green-100 to-blue-100 shadow-md mt-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-6 text-3xl font-bold text-sky-900 focus:outline-none"
      >
        {name} {/* ชื่อ Section ตามที่เราตั้งเอง */}
      </button>
      </div>
      {isOpen && (
        <div className="p-4 flex flex-col gap-4">
          {lectures.map((lecture, idx) => (
            <LectureCard key={idx} {...lecture} />
          ))}
        </div>
      )}
    
    </div>
  );
}

