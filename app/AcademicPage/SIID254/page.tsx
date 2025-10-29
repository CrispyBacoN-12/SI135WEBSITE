"use client";

import React, { useEffect, useState } from 'react';
import SectionCard from '../../components/Section'; // คอมโพเนนต์สำหรับแสดง Lecture
import SummativeCard from "../../components/SummativeComponent"; // คอมโพเนนต์สำหรับแสดง Summative
import Image from "next/image";

const SIID254 = () => {
 // URLs ของคุณ
const SHEET_ID = "1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg";

// แท็บ Lectures
const LEC_SHEET = "254 (Neuro)";
const lecUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
  LEC_SHEET
)}`;

// แท็บ Summative
const SUM_SHEET = "Summative";
const sumUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
  SUM_SHEET
)}`;

// ===== helper =====
const parseGViz = (text) => {
  const m = text.match(/setResponse\((.*)\);/);
  if (!m) throw new Error("Invalid GViz response");
  const json = JSON.parse(m[1]);
  return json.table?.rows ?? [];
};

// ===== state =====
const [sections, setSections] = useState([]);
const [summativeList, setSummativeList] = useState([]);

// สำหรับแบ่ง section
const numberTriggers = [1, 5, 13, 17, 29];
const sectionNames = [
  "Introduction",
  "PNS & Spinal Cord",
  "Brainstem",
  "Special senses",
  "Higher cortical functions",
];

// ===== ดึง Lectures =====
useEffect(() => {
  fetch(lecUrl)
    .then((r) => r.text())
    .then((t) => {
      const rows = parseGViz(t);

      const allLectures = rows
        .map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;

          const number = Number(cell(0));
          const title = cell(1);
          const type = cell(2);
          const date = cell(10);

          // ลิงก์เนื้อหา 13..18 (ชื่อ/ลิงก์ เป็นคู่ ๆ)
          const rowLectures = [];
          for (let i = 12; i <= 17; i += 2) {
            const name = cell(i);
            const link = cell(i + 1);
            if (name && link) {
              rowLectures.push({
                name,
                link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
          }

          // Summary ถ้ามี
          const summary = [];       
            const link = cell(18);
            if (link) {
              summary.push({
                name: "Summary",
                link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });}

            const link2 = cell(19);
            if (link2) {
              summary.push({
                name: "Clinical Case",
                link: link2,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
          }

          if (!number || !title) return null;
          return { number, title, type, date, lectures: rowLectures, summary };
        })
        .filter(Boolean);

      // group เป็น sections ตาม trigger
      let current = null;
      let idx = -1;
      const grouped = [];

      for (const lec of allLectures) {
        const trigIdx = numberTriggers.indexOf(lec.number);
        if (trigIdx !== -1 || !current) {
          idx += 1;
          current = {
            id: idx,
            name: sectionNames[trigIdx] || `Section ${idx + 1}`,
            lectures: [],
          };
          grouped.push(current);
        }
        current.lectures.push(lec);
      }

      setSections(grouped);
    })
    .catch((e) => console.error("fetch lectures failed:", e));
}, [lecUrl]);

// ===== ดึง Summative =====
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

          const s1Link = cell(13);
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

          const s1KeyLink = cell(14);
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

          const s2Link = cell(15);
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

          const s2KeyLink = cell(16);
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


const courses = [ { code: 'SI134', link: 'https://siriraj134.com/acad/siid254', linkname: 'SI134(254)' }, 
  { code: 'SI133', link: 'https://sites.google.com/view/siriraj133official/archives/year-2/siid-254', linkname: 'SI133(254)' }, 
  { code: 'SI132', link: 'https://sites.google.com/view/siriraj132/archives/year-2/siid254', linkname: 'SI132(254)' },
   { code: 'SI131', link: 'https://sites.google.com/view/siriraj131official/archives/sophomore/224', linkname: 'SI131(224)' },
    { code: 'SI130', link: 'https://sites.google.com/view/siriraj130/archives/year-2/224', linkname: 'SI130(224)' },
     { code: 'SI129', link: 'https://sites.google.com/view/si129academicportal/archive/sophomore/224', linkname: 'SI129(224)'}, 
     { code: 'SI128', link: 'https://sites.google.com/view/siriraj128/224', linkname: 'SI128(224)'}, ]; 
     return ( 
     <> 
     {/* breadcrumb */} 
     <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm"> 
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa"> 
        <div className="flex gap-2 items-center grow"> 
          <a className="hover:underline" href="/academics">Academic</a> 
          <span>/</span> 
          <span>SIID254</span> 
          </div> 
          </div> 
          </div> 
          {/* Main content */}
           <div className="container mx-auto px-4 sm:px-6 md:px-8"> 
            <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10"> 
              <Image 
              src="/SIID254.jpg" 
              alt="SIID254" 
              width={300} 
              height={800} 
              className="w-full md:w-[300px] h-[250px] object-cover rounded-lg mb-3 md:mb-0 md:mr-8 flex-shrink-0" />
               <div className="text-left space-y-1 font-preuksa"> 
                <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 1</p>
                 <p className="text-3xl text-gray-700 italic">SIID254</p> 
                 <p className="text-base text-gray-600">Nervous system</p>
                  <div className="flex gap-2 items-center flex-wrap"> 
                    <a href="https://sirirajcanvas.instructure.com/courses/1066" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1" > 
                    <Image 
                    src="/CANVAS.png" 
                    alt="SI Canvas Logo" width={34} height={20} className="inline" /> Canvas </a> 
                    <a
                href="https://www.youtube.com/playlist?list=PLnWAv0tkYmKG_twJfrYi4L-DPfHAmqEor"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image src="/youtube.jpg" alt="Youtube Logo" width={34} height={20} className="inline" />
                Video By P'Jedi
              </a>
                    </div> 
                    </div> 
                    </div> 
                    </div> 
                    <div> 
                      <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8"> เว็บวิชาการรุ่นพี่ </div> 
                      <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8"> 
                        {courses.map(({ code, link, linkname }) => 
                        ( <li key={code}> 
                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors" > {linkname} 
                          </a> 
                          </li>
                           ))} 
                           </ul> 
                           </div> 
                           {/* Lectures Section */} 
                           <div className=" mx-auto flex flex-col gap-4 mt-8"> 
                            { sections.map((lec, idx) => 
                            ( <SectionCard key={idx} {...lec} /> // แสดงผลข้อมูล lectures 
                              )
                              )} 
                            </div> 
                            {/* Summative Section */} 
                            <div className=" mx-auto mb-4"> 
                            <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-8 "> 
                              <div className="pl-4 max-w-screen-2xl font-bold text-3xl text-sky-900"> Summative Examination </div>
                               </div>
                                <div className="flex flex-col gap-4 mt-4"> 
                                  {summativeList.map((lec, idx) =>
                                   ( <SummativeCard key={idx} {...lec} /> // แสดงผลข้อมูล Summative 
                                   ))} 
                                   </div> 
                                   </div> 
                                   </>
  );
};

export default SIID254;
