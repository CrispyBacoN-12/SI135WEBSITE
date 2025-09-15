import Link from "next/link";
import UPCOMING from "./components/UPCOMING EVENT";
import Material from "./components/Material & Useful Links";
import Calendar from "./components/calendar";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="bg-black shadow-md">
        <div className="max-w-screen-3xl mx-auto px-1 py-4">
          <div className="flex justify-evenly text-gray-200 text-sm font-semibold">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/academics" className="hover:underline">Academics</Link>
            <Link href="/student-impact" className="hover:underline">Student Impact</Link>
            <Link href="/useful-info" className="hover:underline">Useful Info</Link>
          </div>
        </div>
      </nav>
      <UPCOMING/>

      <Material/>

      <Calendar/>
      {children}
      
    </>
  );
}