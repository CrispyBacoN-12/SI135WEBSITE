"use client";

import React from "react";
import { useAdmin } from "./AdminContext";
import UploadButton from "./UploadButton";

interface LinkSlot {
  name: string;
  link: string | null;
  icon?: React.ReactNode;
  col: number;
}

interface SummativeCardProps {
  title: string;
  handouts?: LinkSlot[];
  sheetRow?: number;
  sheetId?: string;
  sheetName?: string;
}

export default function SummativeCard({
  title,
  handouts = [],
  sheetRow,
  sheetId,
  sheetName,
}: SummativeCardProps) {
  const { isAdmin } = useAdmin();

  const visibleSlots = isAdmin ? handouts : handouts.filter((h) => h.link);

  if (!isAdmin && visibleSlots.length === 0) return null;

  return (
    <div className="flex flex-row mt-1 pl-6 gap-1 w-full">
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-2xl sm:text-xl font-preuksa leading-tight sm:leading-tight">
          {title}
        </h2>

        <div className="flex flex-wrap gap-2 mt-2 items-center text-sm">
          {visibleSlots.map((h, idx) => (
            <span key={idx} className="inline-flex items-center gap-1">
              {h.link ? (
                <a
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-black-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center"
                >
                  <span className="inline-block mr-1 text-black-400 font-semibold">{h.name}</span>
                </a>
              ) : isAdmin ? (
                <span className="text-xs text-gray-400 border border-dashed border-gray-200 rounded px-1 py-0.5">
                  {h.name}
                </span>
              ) : null}
              {isAdmin && sheetId && sheetName && sheetRow !== undefined && (
                <UploadButton
                  target={{ sheetId, sheetName, row: sheetRow, col: h.col }}
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
