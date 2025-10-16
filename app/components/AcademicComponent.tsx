// LectureCard.js
import React from 'react';

export default function LectureCard({ number, title, date, type, lectures, summary }) {
  return (
    <div className="flex flex-row gap-1 w-full">
      {/* เลขลำดับ */}
      <div className="flex flex-col pl-6">
        <div className="block whitespace-nowrap font-bold text-lg sm:text-xl font-preuksa leading-tight sm:leading-tight bg-gradient-to-br from-green-600 to-blue-600 text-transparent bg-clip-text" style={{ width: '28px' }}>
          {number}
        </div>
      </div>

      {/* ข้อมูลเนื้อหา */}
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-lg sm:text-xl font-preuksa leading-tight sm:leading-tight">{title}</h2>
        <div className="flex gap-1.5 items-center mt-1">
          <span className="text-sm text-black-500">{date}</span>
          <span className="text-xs bg-gradient-to-br from-slate-200/70 to-slate-200 text-branddarkgreen px-2 py-0.5 rounded-full">{type}</span>
        </div>

       <div className="flex flex-wrap gap-2 mt-2 items-center text-sm">
  {[...handout,...lectures, ...summary].map((h, idx) => (
    <a
      key={idx}
      href={h.link}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-slate-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center"
    >
      {h.icon && h.icon} {/* แสดง icon ถ้ามี */}
    <h2 className="inline-block mr-1 text-black-400">{h.name}</h2>
    </a>
  ))}
</div>

      </div>
    </div>
  );
}
