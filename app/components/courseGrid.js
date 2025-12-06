// components/CourseGrid.js
import React from "react";

// กำหนดโครงสร้างข้อมูลที่คาดหวังสำหรับรายการคอร์ส
// { code, href, src }
const CourseGrid = ({ courses }) => {
  return (
    <div className="w-full py-6">
      {/* Card grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
        {courses.map(({ code, href, src }) => (
          <li key={code} className="group">
            <a
              href={href}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
            >
              <div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                {/* Image wrapper with responsive aspect ratio */}
                <div className="relative aspect-square md:aspect-[4/3]">
                  <img
                    src={src}
                    alt={code}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Label */}
                <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
                  {code}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseGrid;
