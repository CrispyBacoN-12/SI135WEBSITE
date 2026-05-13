"use client";

import React from "react";
import Link from "next/link";
import { useAdmin } from "./AdminContext";

export default function AdminNavItem() {
  const { isAdmin, logout } = useAdmin();

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full">
          Admin
        </span>
        <button
          onClick={logout}
          className="text-xs text-sky-700 hover:underline"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/admin/login" className="text-xs text-sky-700 hover:underline">
      Admin
    </Link>
  );
}
