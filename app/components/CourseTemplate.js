// components/CourseTemplate.js
"use client";

import React, { useEffect, useState } from 'react';
import LectureCard from "./AcademicComponent"; // Path ต้องถูกต้อง
import SummativeCard from "./SummativeComponent"; // Path ต้องถูกต้อง
import Image from "next/image";
import { coursesSeniorLinks } from '../data/courseDetails'; // ดึงข้อมูลลิงก์รุ่นพี่

// Helper Functions (ย้ายมาจาก SIID245.js)
const parseGViz = (text) => {
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows;
};

const convertDriveLink = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return url;
    const fileId = match[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
};

// Component แม่แบบหลัก ที่รับตัวแปรทั้งหมด
const CourseTemplate = ({ courseCode, sheetName, courseTitle, yearSem, canvasLink, youtubeLink }) => {
  const [lectures, setLectures] = useState([]);
  const [summativeList, setSummativeList] = useState([]);

  // ⭐️ ใช้ตัวแปรที่รับมาสร้าง URL
  const lectureUrl = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=${sheetName}&tq=select%20*%20limit%2022`;
  const sumUrl = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=Summative&tq=select%20*%20limit%2022`; 

// ------------------------------------------------------------------
// LOGIC 1: FETCH LECTURES
// ------------------------------------------------------------------
  useEffect(() => {
    fetch(lectureUrl)
      .then((response) => response.text())
      .then((text) => {
        const jsonData = JSON.parse(text.substring(47).slice(0, -2));
        const rows = jsonData.table.rows;

        const lecturesData = rows.map((row) => {
          // ... (Logic การดึงข้อมูล Lecture และสร้าง Icon เหมือนเดิม) ...
          const number = row.c[0]?.v;
          const title = row.c[1]?.v;
          const type = row.c[2]?.v;
          
          const IconSvg = ({ fill = "currentColor" }) => (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill={fill}>
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
             );

          const lectures = [];
          for (let i = 13; i <= 18; i += 2) {
            const name = row.c[i]?.v;
            const link = row.c[i + 1]?.v;
            if (name && link) {
              lectures.push({ name, link, icon: <IconSvg /> });
            }
          }

          const summary = [];
          const summaryLink = row.c[19]?.v;
          if(summaryLink) {
            summary.push({ name: 'summary', link: summaryLink, icon: <IconSvg /> });
          }

            if(number && title && type) {
              return { number, title, type, lectures, summary };
            } return null;
        }).filter(Boolean);

        setLectures(lecturesData);
      })
      .catch((error) => console.error("Error fetching lectures:", error));
  }, [lectureUrl]); // ⭐️ ต้องใส่ lectureUrl ใน dependency array

// ------------------------------------------------------------------
// LOGIC 2: FETCH SUMMATIVE
// ------------------------------------------------------------------
  useEffect(() => {
    fetch(sumUrl)
      .then((r) => r.text())
      .then((t) => {
        const rows = parseGViz(t);

        const data = rows
          .map((row) => {
            const cell = (i) => row.c?.[i]?.v ?? null;
            const title = cell(0);
            const handouts = [];

            // ... (Logic การดึงข้อมูล Summative เหมือนเดิม) ...
            const IconSvg = ({ fill = "currentColor" }) => (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill={fill}>
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
             );
            
            const s1Link = cell(17);
            const s1KeyLink = cell(18);
            const s2Link = cell(19);
            const s2KeyLink = cell(20);

            if (s1Link) handouts.push({ name: "Summative", link: convertDriveLink(s1Link), icon: <IconSvg /> });
            if (s1KeyLink) handouts.push({ name: "SummativeKey", link: convertDriveLink(s1KeyLink), icon: <IconSvg /> });
            if (s2Link) handouts.push({ name: "Summative 2", link: convertDriveLink(s2Link), icon: <IconSvg /> });
            if (s2KeyLink) handouts.push({ name: "SummativeKey2", link: convertDriveLink(s2KeyLink), icon: <IconSvg /> });

            if (!title || handouts.length === 0) return null;
            return { title, handouts };
          })
          .filter(Boolean);

        setSummativeList(data);
      })
      .catch((e) => console.error("fetch summative failed:", e));
  }, [sumUrl]);
  
// ------------------------------------------------------------------
// JSX (ส่วนแสดงผล)
// ------------------------------------------------------------------
  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>{courseCode}</span> {/* ⭐️ ใช้ Prop */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src={`/${courseCode}.png`} {/* ⭐️ ใช้ Prop */}
            alt={courseCode}
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover object-top rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">{yearSem}</p> {/* ⭐️ ใช้ Prop */}
            <p className="text-3xl text-gray-700 italic">{courseCode}</p> {/* ⭐️ ใช้ Prop */}
            <p className="text-base text-gray-600">{courseTitle}</p> {/* ⭐️ ใช้ Prop */}
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href={canvasLink} {/* ⭐️ ใช้ Prop */}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                {/* ... Image ... */} Canvas
              </a>
              <a
                href={youtubeLink} {/* ⭐️ ใช้ Prop */}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                {/* ... Image ... */} Video By P'Jedi
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* เว็บวิชาการรุ่นพี่ */}
      <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8"> เว็บวิชาการรุ่นพี่ </div> 
                      <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8"> 
                        {coursesSeniorLinks.map(({ code, link, linkname }) =>  {/* ⭐️ ใช้ข้อมูลที่ Import เข้ามา */}
                        ( <li key={code}> 
                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors" > {linkname} 
                          </a> 
                          </li>
                           ))} 
                           </ul> 
                         

      {/* Lectures Section */}
      <div className=" mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => (
          <LectureCard key={idx} {...lec} />
        ))}
      </div>

      {/* Summative Section */}
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-4">
          <div className="w-full text-left px-4 text-3xl font-bold text-sky-900 focus:outline-none">
            Summative Examination
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
         {summativeList.map((lec, idx) => (
   <SummativeCard key={idx} {...lec} />
))}
        </div>
      </div>
    </>
  );
};

export default CourseTemplate;
