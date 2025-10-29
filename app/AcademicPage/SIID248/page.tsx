"use client";

import React, { useEffect, useState } from 'react';
import LectureCard from "../../components/AcademicComponent"; // คอมโพเนนต์สำหรับแสดง Lecture
import SummativeCard from "../../components/SummativeComponent"; // คอมโพเนนต์สำหรับแสดง Summative
import Image from "next/image";

const SIID248 = () => {
  const [lectures, setLectures] = useState([]);  // เก็บข้อมูล lectures ที่ดึงมาจาก Google Sheets
  const [summativeList, setSummativeList] = useState([]);
  const summative = [{ title: 'SI134', handouts: [{ name: 'Summative', link: '#' }] }]; // ข้อมูล Summative ที่เป็นตัวอย่าง
   const parseGViz = (text) => {
  const json = JSON.parse(text.substring(47).slice(0, -2));
  return json.table.rows;
};
    const url = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=248%20(Hemato)&tq=select%20*%20limit%2022
`;
   const sumUrl = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=Summative2&tq=select%20*%20limit%2022`; 
  const icon = (
    <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 448 512">
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448
      c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
    </svg>
  );

  // ✅ ดึงข้อมูล Lecture
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseGViz(text);

        const data = rows
          .map((row) => {
            const cell = (i) => row.c?.[i]?.v ?? null;
            const number = cell(0);
            const title = cell(1);
            const type = cell(2);

            const handout = [];
            for (let i = 14; i <= 16; i++) {
              const name = "Handout";
              const link = cell(i);
              if (link) handout.push({ name,link, icon });
            }

            const lectureLinks = [];
            for (let i = 17; i <= 22; i += 2) {
              const name = cell(i);
              const link = cell(i + 1);
              if (name && link) lectureLinks.push({ name, link, icon });
            }

            const summaryLink = cell(23);
            const summary = summaryLink ? [{ name: "Summary", link: summaryLink, icon }] : [];

            if (!number || !title || !type) return null;
            return { number, title, type, handout, lectures: lectureLinks, summary };
          })
          .filter(Boolean);

        setLectures(data);
      })
      .catch((err) => console.error("Error fetching lectures:", err));
  }, []);

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

          // helper แปลงลิงก์
          const convertDriveLink = (url) => {
            const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (!match) return url;
            const fileId = match[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
          };

          const s1Link = cell(17);
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

          const s1KeyLink = cell(18);
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

          const s2Link = cell(19);
          if (s2Link) {
            handouts.push({
              name: "Summative(LM)",
              link: convertDriveLink(s2Link),
              icon: (
                <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                </svg>
              ),
            });
          }

          const s2KeyLink = cell(20);
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

  const courses = [ { code: 'SI134', link: 'https://siriraj134.com/acad/siid248', linkname: 'SI134(248)' }, 
  { code: 'SI133', link: 'https://sites.google.com/view/siriraj133official/archives/year-2/siid-248', linkname: 'SI133(248)' }, 
  { code: 'SI132', link: 'https://sites.google.com/view/siriraj132/archives/year-2/siid248', linkname: 'SI132(248)' },
   { code: 'SI131', link: 'https://sites.google.com/view/siriraj131official/archives/sophomore/218', linkname: 'SI131(218)' },
    { code: 'SI130', link: 'https://sites.google.com/view/siriraj130/archives/year-2/218', linkname: 'SI130(218)' },
     { code: 'SI129', link: 'https://sites.google.com/view/si129academicportal/archive/sophomore/218', linkname: 'SI129(218)'}, 
     { code: 'SI128', link: 'https://sites.google.com/view/siriraj128/218', linkname: 'SI128(218)'}, ]; 


  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>SIID248</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID248.png"
            alt="SIID248"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover object-top rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 1</p>
            <p className="text-3xl text-gray-700 italic">SIID248</p>
            <p className="text-base text-gray-600">Blood, Lymphoid and Immune System</p>
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1069"
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
              <a
                href="https://m.youtube.com/playlist?list=PLnWAv0tkYmKGNO1GqIvWjfFhWZlQTu28I"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image
                  src="/youtube.jpg"
                  alt="Youtube Logo"
                  width={34}
                  height={20}
                  className="inline"
                />
                Video By AcadTeam
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8"> เว็บวิชาการรุ่นพี่ </div> 
                      <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8"> 
                        {courses.map(({ code, link, linkname }) => 
                        ( <li key={code}> 
                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors" > {linkname} 
                          </a> 
                          </li>
                           ))} 
                           </ul> 

      {/* Lectures Section */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => (
          <LectureCard key={idx} {...lec} /> // แสดงผลข้อมูล lectures
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

export default SIID248;
