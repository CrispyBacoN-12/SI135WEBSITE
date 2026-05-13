"use client";

import React from "react";
import { useAdmin } from "./AdminContext";
import UploadButton from "./UploadButton";

interface LinkSlot {
  name: string;
  link: string | null;
  icon?: React.ReactNode;
  col: number;
  nameCol?: number;
  defaultName?: string;
}

interface LectureCardProps {
  number: string | number;
  title: string;
  type: string;
  handout?: LinkSlot[];
  lectures?: LinkSlot[];
  summary?: LinkSlot[];
  sheetRow?: number;
  sheetId?: string;
  sheetName?: string;
}

export default function LectureCard({
  number,
  title,
  type,
  handout = [],
  lectures = [],
  summary = [],
  sheetRow,
  sheetId,
  sheetName,
}: LectureCardProps) {
  const { isAdmin } = useAdmin();

  const allSlots = [...handout, ...lectures, ...summary];
  const visibleSlots = isAdmin ? allSlots : allSlots.filter((h) => h.link);

  return (
    <div className="flex flex-row gap-1 w-full">
      {/* เลขลำดับ */}
      <div className="flex flex-col pl-6">
        <div
          className="block whitespace-nowrap font-bold text-lg sm:text-xl font-preuksa leading-tight sm:leading-tight bg-gradient-to-br from-green-600 to-blue-600 text-transparent bg-clip-text"
          style={{ width: "28px" }}
        >
          {number}
        </div>
      </div>

      {/* ข้อมูลเนื้อหา */}
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-lg sm:text-xl font-preuksa leading-tight sm:leading-tight">
          {title}
        </h2>
        <div className="flex gap-1.5 items-center mt-1">
          <span className="text-xs bg-gradient-to-br from-slate-200/70 to-slate-200 text-branddarkgreen px-2 py-0.5 rounded-full">
            {type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 items-center text-sm">
          {visibleSlots.map((h, idx) => (
            <span key={idx} className="inline-flex items-center gap-1">
              {h.link ? (
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center"
                >
                  {h.icon && h.icon}
                  <span className="inline-block mr-1 text-black-400">{h.name}</span>
                </a>
              ) : isAdmin ? (
                <span className="text-xs text-gray-400 border border-dashed border-gray-200 rounded px-1 py-0.5">
                  {h.name}
                </span>
              ) : null}
              {isAdmin && sheetId && sheetName && sheetRow !== undefined && (
                <UploadButton
                  target={{
                    sheetId,
                    sheetName,
                    row: sheetRow,
                    col: h.col,
                    nameCol: h.nameCol,
                    defaultName: h.defaultName,
                  }}
                  existingLink={h.link}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
