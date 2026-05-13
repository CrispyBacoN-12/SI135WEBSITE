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
      // 1. Request presigned URL from server
      let presignedUrl: string, publicUrl: string;
      try {
        const presignRes = await fetch("/api/admin/presign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
        });
        const presignData = await presignRes.json().catch(() => ({}));
        if (!presignRes.ok) throw new Error(`[Step 1] ${presignData.error ?? presignRes.status}`);
        presignedUrl = presignData.presignedUrl;
        publicUrl = presignData.publicUrl;
      } catch (e: any) {
        throw new Error(e.message.startsWith("[Step 1]") ? e.message : `[Step 1] ${e.message}`);
      }

      // 2. Upload file directly to R2 via presigned URL
      try {
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "application/octet-stream" },
          body: file,
        });
        if (!uploadRes.ok) throw new Error(`HTTP ${uploadRes.status}`);
      } catch (e: any) {
        throw new Error(`[Step 2 - R2 Upload] ${e.message} — ตรวจสอบ CORS ใน R2 bucket`);
      }

      // 3. Write public URL to Google Sheets
      try {
        const { range } = await writeCell(token, target.sheetId, target.sheetName, target.row, target.col, publicUrl!);
        console.log(`[Upload] Written to: ${range}`);
        if (target.nameCol !== undefined && target.defaultName) {
          await writeCell(token, target.sheetId, target.sheetName, target.row, target.nameCol, target.defaultName);
        }
      } catch (e: any) {
        throw new Error(`[Step 3 - Sheets] ${e.message}`);
      }

      setSuccess(true);
      onUploaded?.(publicUrl!);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
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
        <span className="text-red-500 text-xs" title={errorMsg}>⚠ {errorMsg}</span>
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
): Promise<{ range: string }> {
  const res = await fetch("/api/admin/sheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sheetId, sheetName, row, col, value }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Sheets update ล้มเหลว");
  }
  return data;
}
