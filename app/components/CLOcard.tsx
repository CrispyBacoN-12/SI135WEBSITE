// LectureCard.js
import React from 'react';

export default function CLOCard({  title, CLO = [] }) {
  return (
    <div className="flex flex-row mt-1 pl-6 gap-1 w-full">

      {/* ข้อมูลเนื้อหา */}
      <div className="flex flex-col w-full">
        <h2 className="font-bold text-2xl sm:text-xl font-preuksa leading-tight sm:leading-tight">{title}</h2>

        <div className="flex flex-wrap gap-2 mt-2 items-center text-sm">
          {CLO.map((h, idx) => (
            <a
              key={idx}
              href={h.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black-400 rounded-lg py-1 px-2 w-fit bg-transparent hover:bg-slate-200 transition-colors flex items-center"
            >
              <h2 className="inline-block mr-1 text-black-400 font-semibold ">{h.name}</h2>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
