"use client";

import React, { useRef, useState } from "react";
import { useAdmin } from "./AdminContext";

export interface UploadTarget {
  sheetId: string;
  sheetName: string;
  row: number;
  col: number;
  nameCol?: number;
  defaultName?: string;
}

interface Props {
  target: UploadTarget;
  existingLink?: string | null;
  onUploaded?: (url: string) => void;
}

export default function UploadButton({ target, existingLink, onUploaded }: Props) {
  const { isAdmin } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isAdmin) return null;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccess(false);

    const token = localStorage.getItem("adminToken") ?? "";

    try {
      // 1. Upload file to R2
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error ?? "Upload ล้มเหลว");
      }
      const { url } = await uploadRes.json();

      // 2. Write URL to Google Sheets (link column)
      await writeCell(token, target.sheetId, target.sheetName, target.row, target.col, url);

      // 3. If this slot also has a name column, set the display name
      if (target.nameCol !== undefined && target.defaultName) {
        await writeCell(token, target.sheetId, target.sheetName, target.row, target.nameCol, target.defaultName);
      }

      setSuccess(true);
      onUploaded?.(url);
    } catch (err: any) {
      setErrorMsg(err.message ?? "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <span className="inline-flex items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        title={existingLink ? "แทนที่ไฟล์" : "อัพโหลดไฟล์"}
        className={`border border-dashed rounded-lg py-0.5 px-2 text-xs transition-colors flex items-center gap-1 ${
          loading
            ? "border-gray-300 text-gray-400 cursor-wait"
            : existingLink
            ? "border-amber-400 text-amber-600 hover:bg-amber-50"
            : "border-sky-400 text-sky-600 hover:bg-sky-50"
        }`}
      >
        {loading ? "⏳" : existingLink ? "↑ Replace" : "↑ Upload"}
      </button>
      {errorMsg && (
        <span className="text-red-500 text-xs" title={errorMsg}>⚠</span>
      )}
      {success && !errorMsg && (
        <span className="text-green-500 text-xs">✓</span>
      )}
    </span>
  );
}

async function writeCell(
  token: string,
  sheetId: string,
  sheetName: string,
  row: number,
  col: number,
  value: string
) {
  const res = await fetch("/api/admin/sheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sheetId, sheetName, row, col, value }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Sheets update ล้มเหลว");
  }
}
