"use client";

import React, { useEffect, useState } from 'react';
import LectureCard from "../../components/AcademicComponent"; // คอมโพเนนต์สำหรับแสดง Lecture
import SummativeCard from "../../components/SummativeComponent"; // คอมโพเนนต์สำหรับแสดง Summative
import Image from "next/image";

const SIID245 = () => {
  const [lectures, setLectures] = useState([]);  // เก็บข้อมูล lectures ที่ดึงมาจาก Google Sheets
  const [summativeList, setSummativeList] = useState([]);
  const summative = [{ title: 'SI134', handouts: [{ name: 'Summative', link: '#' }] }]; // ข้อมูล Summative ที่เป็นตัวอย่าง
   const parseGViz = (text) => {
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows;
};

  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=245%20(MSK)&tq=select%20*%20limit%2022
`;
      const sumUrl = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=Summative&tq=select%20*%20limit%2022`;


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
for (let i = 13; i <= 18; i += 2) {
  const name = row.c[i]?.v;
  const link = row.c[i + 1]?.v;
  if (name && link) {
    lectures.push({ name, link,icon: (
    <svg
      className="w-4 h-4 mr-1 inline"
      fill="currentColor"
      viewBox="0 0 448 512"
    >
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"></path>
    </svg>) });
  }
}

const summary = [];
const summaryLink = row.c[19]?.v;
if(summaryLink)
{
  summary.push({ name: 'summary', link: summaryLink,icon:(<svg
      className="w-4 h-4 mr-1 inline"
      fill="currentColor"
      viewBox="0 0 448 512"
    >
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"></path>
    </svg>) });
}
        if(number && title && type)
        {
          return { number, title, date, type, lectures, summary }; // ส่งข้อมูลที่จัดเตรียมไว้
        } return null; // ถ้าไม่ครบ return null
  })
  .filter(Boolean);


        // อัปเดตข้อมูล lectures ใน state
        setLectures(lecturesData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // ใช้ [] เพื่อให้ `useEffect` ทำงานเพียงครั้งเดียวเมื่อ component ถูกโหลด

  useEffect(() => {
  fetch(Sumurl)
    .then((r) => r.text())
    .then((t) => {
      const rows = parseGViz(t);

      const data = rows
        .map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;

          const title = cell(0);
          const handouts = [];

          // helper แปลงลิงก์
          const convertDriveLink = (url) => {
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (!match) return url;
            const fileId = match[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
          };

          const s1Link = cell(22);
          if (s1Link) {
            handouts.push({
              name: "Summative",
              link: convertDriveLink(s1Link),   // ✅ ใช้ฟังก์ชันแปลง
              icon: (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
              ),
            });
          }

          const s1KeyLink = cell(23);
          if (s1KeyLink) {
            handouts.push({
              name: "SummativeKey",
              link: convertDriveLink(s1KeyLink),
              icon: (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
              ),
            });
          }

          const s2Link = cell(24);
          if (s2Link) {
            handouts.push({
              name: "Summative 2",
              link: convertDriveLink(s2Link),
              icon: (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
              ),
            });
          }

          const s2KeyLink = cell(25);
          if (s2KeyLink) {
            handouts.push({
              name: "SummativeKey2",
              link: convertDriveLink(s2KeyLink),
              icon: (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
              ),
            });
          }

          if (!title || handouts.length === 0) return null;
          return { title, handouts };
        })
        .filter(Boolean);

      setSummativeList(data);
    })
    .catch((e) => console.error("fetch summative failed:", e));
}, [sumUrl]);


  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>SIID245</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID245.jpg"
            alt="SIID245"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 1</p>
            <p className="text-3xl text-gray-700 italic">SIID245</p>
            <p className="text-base text-gray-600">Integumentary System, Skeleton and Movement</p>
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1065"
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

export default SIID245;
