"use client";

import React, { useEffect, useState } from 'react';
import SectionCard from '../../components/Section';
import SummativeCard from "../../components/SummativeComponent"; // คอมโพเนนต์สำหรับแสดง Summative
import Image from "next/image";

const SIID246 = () => {
  // URLs ของคุณ
  const SHEET_ID = "1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg";

  // แท็บ Lectures
  const LEC_SHEET = "246 (Gross1)";
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
    const m = text.match(/setResponse\((.*)\);/); // ใช้ /s
    if (!m) throw new Error("Invalid GViz response");
    const json = JSON.parse(m[1]);
    return json.table?.rows ?? [];
  };

  // ===== constants สำหรับจัดกลุ่มตามลำดับที่ต้องการ =====
  const sectionNames = [
    "BodyWall&Axilla",
    "UpperLimb",
    "Head&Neck",
    "LowerLimb",
    "Ultrasographic Study",
  ];

  // เลขลำดับ (คอลัมน์ 1 ในชีตของคุณ) ที่จะ "เริ่มเซกชันใหม่"
  const TRIGGERS = [1,];

  // (แนะนำ) ย้ายไอคอนออกจากลูป
  const FileIcon = () => (
    <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
    </svg>
  );
  // ===== state =====
  const [sections, setSections] = useState([]);
  const [summativeList, setSummativeList] = useState([]);
  const [summativeList2, setSummativeList2] = useState([]);

  useEffect(() => {
    fetch(lecUrl)
      .then((r) => r.text())
      .then((t) => {
        const rows = parseGViz(t);

        // 1) แปลงเป็น allLectures
        const allLectures = rows
          .map((row) => {
            const cell = (i) => row.c?.[i]?.v ?? null;

            // ตาม schema ล่าสุดของคุณ:
            const number = Number(cell(1)); // ใช้เป็นตัวชี้ trigger
            const title = cell(2);
            const type = "LAB";
            const date = cell(10);

            if (!title) return null;

            const lectures = [];
            if (cell(14)) lectures.push({ name: "Lecture", link: cell(14), icon: <FileIcon /> });
            if (cell(15)) lectures.push({ name: "Clinical Lab", link: cell(15), icon: <FileIcon /> });
            if (cell(16)) lectures.push({ name: "CLO Finished", link: cell(16), icon: <FileIcon /> });

            const summary = [];
            for (let i = 17; i <= 19; i += 1) {
              const link = cell(i);
              if (link) summary.push({ name: "Summary", link, icon: <FileIcon /> });
            }

            return { number, title, type, date, lectures, summary };
          })
          .filter(Boolean);

        // 2) จัดกลุ่มครั้งเดียวตาม TRIGGERS -> sectionNames
        let sectionIndex = -1;
        let current = null;
        const grouped = [];

        for (const lec of allLectures) {
          const isTrigger = TRIGGERS.includes(lec.number);
          if (isTrigger || !current) {
            sectionIndex += 1;
            current = {
              id: sectionIndex,
              name: sectionNames[sectionIndex] || `Section ${sectionIndex + 1}`,
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
            const mock = cell(1);
            const mockname = "MockExam";
            if (mock) {
              handouts.push({
                name: mockname,
                link: mock,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const mockAns = cell(2);
            const mocknameAns = "MockAnswer";
            if (mockAns) {
              handouts.push({
                name: mocknameAns,
                link: mockAns,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s1Link = cell(3);
            const s1Name = "Summative";
            if (s1Link) {
              handouts.push({
                name: s1Name,
                link: s1Link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s1KeyLink = cell(4);
            const s1KeyName = "SummativeKey";
            if (s1KeyLink) {
              handouts.push({
                name: s1KeyName,
                link: s1KeyLink,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }

            const s2Link = cell(5);
            const s2Name = "Summative 2";
            if (s2Link) {
              handouts.push({
                name: s2Name,
                link: s2Link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s2KeyLink = cell(6);
            const s2KeyName = "SummativeKey2";
            if (s2KeyLink) {
              handouts.push({
                name: s2KeyName,
                link: s2KeyLink,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            // ถ้าชื่อ/ลิงก์ไม่ได้อยู่คอลัมน์ตามนี้ ปรับ index ให้ตรงชีตจริง
            if (!title || handouts.length === 0) return null;
            return { title, handouts };
          })
          .filter(Boolean);

        setSummativeList(data);
      })
      .catch((e) => console.error("fetch summative failed:", e));
  }, [sumUrl]);

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
            const mock = cell(7);
            const mockname = "MockExam";
            if (mock) {
              handouts.push({
                name: mockname,
                link: mock,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const mockAns = cell(8);
            const mocknameAns = "MockAnswer";
            if (mockAns) {
              handouts.push({
                name: mocknameAns,
                link: mockAns,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s1Link = cell(9);
            const s1Name = "Summative";
            if (s1Link) {
              handouts.push({
                name: s1Name,
                link: s1Link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s1KeyLink = cell(10);
            const s1KeyName = "SummativeKey";
            if (s1KeyLink) {
              handouts.push({
                name: s1KeyName,
                link: s1KeyLink,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }

            const s2Link = cell(11);
            const s2Name = "Summative 2";
            if (s2Link) {
              handouts.push({
                name: s2Name,
                link: s2Link,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            const s2KeyLink = cell(12);
            const s2KeyName = "SummativeKey2";
            if (s2KeyLink) {
              handouts.push({
                name: s2KeyName,
                link: s2KeyLink,
                icon: (
                  <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                  </svg>
                ),
              });
            }
            // ถ้าชื่อ/ลิงก์ไม่ได้อยู่คอลัมน์ตามนี้ ปรับ index ให้ตรงชีตจริง
            if (!title || handouts.length === 0) return null;
            return { title, handouts };
          })
          .filter(Boolean);

        setSummativeList2(data);
      })
      .catch((e) => console.error("fetch summative failed:", e));
  }, [sumUrl]);

  // ใช้ [] เพื่อให้ `useEffect` ทำงานเพียงครั้งเดียวเมื่อ component ถูกโหลด
  const [isSumOpen, setSumIsOpen] = useState(false);
    const [isSum2Open, setSum2IsOpen] = useState(false);
  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>SIID246</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID243.jpg"
            alt="SIID246"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 1</p>
            <p className="text-3xl text-gray-700 italic">SIID246</p>
            <p className="text-base text-gray-600">Laboratory in Structure of Integumentary System,
              Skeleton and Movement</p>
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1071"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image src="/CANVAS.png" alt="SI Canvas Logo" width={34} height={20} className="inline" />
                Canvas
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Section */}
      <div className=" mx-auto flex flex-col gap-4 mt-8">
        {sections.map((section, idx) => (
          <SectionCard key={idx} name={section.name} lectures={section.lectures} />
        ))}
      </div>

      {/* Summative Section */}
      <div className=" mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md mt-8 overflow-hidden">
          <button
        onClick={() => setSumIsOpen(!isSumOpen)}
        className="w-full text-left px-4 py-6 text-3xl font-bold text-sky-900 focus:outline-none"
      > Summative Examination 1</button>

        </div>
             
{isSumOpen && (
  <div className="flex flex-col gap-4 mt-4">
    {summativeList.map((lec, idx) => <SummativeCard key={idx} {...lec} />)}
  </div>
)}

<div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md mt-8 overflow-hidden">
          <button
        onClick={() => setSum2IsOpen(!isSum2Open)}
        className="w-full text-left px-4 py-6 text-3xl font-bold text-sky-900 focus:outline-none"
      > Summative Examination 2</button>

        </div>
             
{isSumOpen && (
  <div className="flex flex-col gap-4 mt-4">
    {summativeList2.map((lec, idx) => <SummativeCard key={idx} {...lec} />)}
  </div>
)}
      </div>
    </>
  );
};


export default SIID246;
