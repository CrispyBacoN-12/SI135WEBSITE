"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // กำหนดข้อความที่จะ overlay ขึ้นอยู่กับเส้นทาง
  const overlayMap: Record<string, string> = {
    "/": "Welcome to SI135",
    "/academics": "Academic Resources",
    "/student-impact": "Student Impact",
    "/useful-info": "Useful Information",
    "/VIP": "SI 888",
  };

  const overlayText = overlayMap[pathname] || "SI135 Website";

  // กำหนดเส้นทางที่ต้องการให้แสดง header
  const shownPaths = ["/", "/academics", "/student-impact", "/useful-info", "/VIP"]; // หน้าเหล่านี้จะแสดง header

  // ถ้าปัจจุบันเส้นทางไม่อยู่ในรายการ shownPaths ให้ไม่ render header
  if (!shownPaths.includes(pathname)) {
    return null; // ไม่แสดง header
  }

  return (
    <header className="relative w-full h-[400px] sm:h-[350px] md:h-[450px]">
      <Image
        src="/banner.jpg"
        alt="SI135 Header Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-10">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold drop-shadow-lg text-center px-4">
          {overlayText}
        </h1>
      </div>
    </header>
  );
}
