"use client";
import "../styles/globals.css";
import Link from "next/link";
import Header from "./components/Header";
import { useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <div className="text-gray-800 min-h-screen">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-200 to-sky-200 shadow-md z-50">
            <div className="max-w-screen-xl mx-auto py-3 flex items-center justify-between px-4">
              {/* Left: Logo */}
              <Link href="/" className="font-bold text-lg text-sky-900">
                SI135
              </Link>

              {/* Center: Menu */}
              <div className="flex items-center justify-between space-x-4 text-sm md:text-base text-sky-800">
                {/* Hamburger for mobile */}
                <button
                  className="md:hidden flex flex-col justify-center items-center space-y-1 text-sky-900"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="block w-6 h-0.5 bg-sky-900"></span>
                  <span className="block w-6 h-0.5 bg-sky-900"></span>
                  <span className="block w-6 h-0.5 bg-sky-900"></span>
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/academics" className="hover:underline font-semibold">
                    Academics
                  </Link>
                  <Link href="/student-impact" className="hover:underline font-semibold">
                    Student Impact
                  </Link>
                  <Link href="/useful-info" className="hover:underline font-semibold">
                    Useful Info
                  </Link>
                  {/*
                  <Link href="/VIP" className="hover:underline font-semibold">
                    VIP
                  </Link> */}
                </div>
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="md:hidden bg-sky-100 px-4 pb-4 flex flex-col space-y-2 text-sky-900">
                <Link href="/academics" className="hover:underline font-semibold">
                  Academics
                </Link>
                <Link href="/student-impact" className="hover:underline font-semibold">
                  Student Impact
                </Link>
                <Link href="/useful-info" className="hover:underline font-semibold">
                  Useful Info
                </Link>
                <Link href="/VIP" className="hover:underline font-semibold">
                  VIP
                </Link>
              </div>
            )}
          </nav>

          {/* Push content down so navbar doesn't overlap */}
          <div>
            {/* Main Header Section */}
            <Header />

            {/* Page Content */}
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
