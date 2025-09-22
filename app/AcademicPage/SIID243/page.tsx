"use client";

import React, { useEffect, useState } from 'react';
import LectureCard from "../../components/AcademicComponent"; // คอมโพเนนต์สำหรับแสดง Lecture
import SummativeCard from "../../components/SummativeComponent"; // คอมโพเนนต์สำหรับแสดง Summative
import Image from "next/image";
 const [lectures, setLectures] = useState([]);  // เก็บข้อมูล lectures ที่ดึงมาจาก Google Sheets
const [summativeList, setSummativeList] = useState([]);
const SIID243 = () => {


  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=243, 244&range=A1:C14
`;

    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        // แปลงข้อมูลที่ได้จาก API เป็น JSON
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));  // แก้ไขข้อมูลที่ได้จาก JSON
        const rows = jsonData.table.rows;

        // ดึงข้อมูลจากแถวที่ได้และแปลงเป็นรูปแบบ lectures
        const lecturesData = rows.map((row) => {
          const number = row.c[0]?.v; // คอลัมน์ 0 คือ หมายเลขของ Lecture
          const title = row.c[1]?.v; // คอลัมน์ 1 คือ ชื่อของ Lecture
          const date = row.c[10]?.v; // คอลัมน์ 10 คือ วันที่
          const type = row.c[2]?.v; // คอลัมน์ 2 คือ ประเภท (Lec)
          const lectures = [];

          // ตรวจสอบ handouts
          if (row.c[4]?.v) lectures.push({ name: row.c[20]?.v, link: '#' });
          if (row.c[5]?.v) lectures.push({ name: row.c[20]?.v, link: '#' });

          return { number, title, date, type, lectures }; // ส่งข้อมูลที่จัดเตรียมไว้
        });

        // อัปเดตข้อมูล lectures ใน state
        setLectures(lecturesData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // ใช้ [] เพื่อให้ `useEffect` ทำงานเพียงครั้งเดียวเมื่อ component ถูกโหลด

  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>SIID243</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID243.jpg"
            alt="SIID243"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 1</p>
            <p className="text-3xl text-gray-700 italic">SIID243</p>
            <p className="text-base text-gray-600">The Human Life</p>
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1067"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image
                  src="/CANVAS.png"
                  alt="SI Canvas Logo"
                  width={34}
                  height={20}
                  className="inline"
                />
                Canvas
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => (
          <LectureCard key={idx} {...lec} /> // แสดงผลข้อมูล lectures
        ))}
      </div>

      {/* Summative Section */}
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-4">
          <div className="pl-4 max-w-screen-2xl mx-auto font-bold text-3xl text-sky-900">
            Summative Examination
          </div>
        </div>
         <div className="flex flex-col gap-4">
         {summativeList.map((lec, idx) => (
   <SummativeCard key={idx} {...lec} />
))}
        </div>
      </div>
    </>
  );
};

export default SIID243;
