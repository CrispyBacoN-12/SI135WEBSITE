"use client";
import GoogleCalendarEvents from "./calendar events";
import Assignments from "./Assignments";
import Examination from "./Examination";

export default function UPCOMING() {
  return (
    <div className="flex flex-col gap-y-6 ">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-200 to-emerald-200 shadow-md py-7">
        <div className="container max-w-screen-2xl mx-auto font-bold text-3xl text-sky-900 px-10">
          UPCOMING EVENTS
        </div>
      </div>

      {/* Google Calendar Events */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 px-4 lg:px-40 py-4">
        {/* Google Calendar (ซ้าย) */}
        <div className="w-full lg:w-1/2">
          <GoogleCalendarEvents />
        </div>

        {/* Assignment + Examination (ขวา) */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-lg p-5 w-full max-w-3xl mx-auto">
            <h3 className="text-blue-700 text-center font-bold text-2xl mb-4">
              📘 Assignment
            </h3>
            {/* สามารถเพิ่มเนื้อหาของ Assignment ได้ที่นี่ */}
            <div className="w-full">
          <Assignments />
        </div>
          </div>

          {/* Examination Box */}
          <div className="bg-white border-l-4 border-blue-500 shadow-md rounded-lg p-5 w-full max-w-3xl mx-auto">
            <h3 className="text-blue-700 text-center font-bold text-2xl mb-1">
              📄 Examination
            </h3>
            {/* สามารถเพิ่มเนื้อหาของ Examination ได้ที่นี่ */}
             <div className="w-full">
          <Examination />
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
