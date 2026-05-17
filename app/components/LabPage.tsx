"use client";

import React from "react";
import LectureCard from "./AcademicComponent"; // หรือพาธที่ถูกต้องของ LectureCard ในโปรเจกต์ของคุณ

interface HandoutItem {
  name: string;
  link: string | null;
  icon: React.ReactNode;
  col: number;
}

interface VideoItem {
  name: string;
  link: string | null;
  icon: React.ReactNode;
  col: number;
  nameCol?: number;
  defaultName?: string;
}

interface LabLecture {
  number: number;
  title: string;
  type: string;
  handout: HandoutItem[];
  lectures: VideoItem[];
  summary: any[];
  sheetRow: number;
}

interface SectionCardProps {
  name: string;
  lectures: LabLecture[];
  sheetId: string;
  sheetName: string;
}

export default function SectionCard({ name, lectures, sheetId, sheetName }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden mb-6 transition-all duration-300 hover:shadow-md">
      {/* Header ของแต่ละ Lab Section (เช่น Region หรือ System ร่างกาย) */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {name}
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-md">
          {lectures.length} {lectures.length <= 1 ? "Session" : "Sessions"}
        </span>
      </div>

      {/* รายการ Lab ย่อยด้านใน */}
      <div className="p-5 sm:p-6 bg-slate-50/30">
        <div className="flex flex-col gap-4">
          {lectures.map((lec, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200/80 hover:shadow-md md:hover:scale-[1.005] transition-all duration-200 overflow-hidden"
            >
              {/* เรียกใช้ LectureCard เดิมของคุณ แต่เสริม Container ครอบเพื่อให้เข้ากับ Grid หน้าเว็บ */}
              <div className="p-1">
                <LectureCard {...lec} sheetId={sheetId} sheetName={sheetName} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
