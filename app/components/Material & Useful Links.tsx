"use client";
import Image from "next/image";
export default function Material() {
  return (<div className="flex flex-col gap-y-6 px-0 pt-2">
    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-200 to-yellow-100 shadow-md py-7">
      <div className="container max-w-screen-2xl mx-auto font-bold text-3xl text-sky-900 px-10">
        Material & Useful Links </div>
    </div>
    <div className="container max-w-screen-2xl mx-auto pt-2 pb-6 flex flex-col gap-3">
      <section className="flex flex-col gap-2 px-10">
        <span className="font-bold text-lg">Learning System & Portal</span>
        <div className="flex gap-2 items-center flex-wrap">
          {/* ลิงก์ Canvas */}
          <a href="https://sirirajcanvas.instructure.com"
            target="_blank" rel="noopener noreferrer"
            className="border border-slate-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1" >
            <Image src="/CANVAS.png"
              alt="SI Canvas Logo"
              width={34}
              height={20}
              className="inline" />Canvas </a>
          {/* ลิงก์ Selecx */}
          <a href="https://selecx-new.si.mahidol.ac.th"
            target="_blank" rel="noopener noreferrer"
            className="border border-slate-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1" >
            <Image src="/SELECx4_LOGO.png"
              alt="SI SELECx Logo"
              width={34}
              height={20}
              className="inline" /> SELECx </a>
          {/* ลิงก์ SmartEDU */}
          <a href="https://smartedu.mahidol.ac.th"
            target="_blank" rel="noopener noreferrer"
            className="border border-slate-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors" >
            SmartEDU </a>
        </div>
      </section>
    </div>
  </div>);
}