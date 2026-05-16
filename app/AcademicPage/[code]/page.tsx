"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { subjectsConfig } from "../../data/subjectsConfig";
import LectureCard from "../../components/AcademicComponent";
import SummativeCard from "../../components/SummativeComponent";
import { useAdmin } from "../../components/AdminContext";
import UploadButton from "../../components/UploadButton";
import Image from "next/image";
import { notFound } from "next/navigation";

const parseGViz = (text) => {
  const table = JSON.parse(text.substring(47).slice(0, -2)).table;
  const rowOffset = (table.parsedNumHeaders ?? 0) + 1;
  return { rows: table.rows, rowOffset };
};

const icon = (
  <svg className="w-4 h-4 mr-1.5 inline transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 448 512">
    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448
    c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
  </svg>
);

const convertDriveLink = (url) => {
  const match = url?.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match
    ? `https://drive.google.com/file/d/${match[1]}/preview`
    : url;
};

const makeUrl = (sheetId, sheet, limit) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&tq=select%20*%20limit%20${limit}`;

export default function SubjectPage() {
  const { code } = useParams();
  const subject = subjectsConfig[code];
  const { isAdmin } = useAdmin();

  const [lectures, setLectures] = useState([]);
  const [summativeList, setSummativeList] = useState([]);
  const [cloList, setCloList] = useState([]);
  const [specialList, setSpecialList] = useState([]);

  const sheetId = subject?.sheetId;
  const lectureSheet = subject?.lectureSheet;
  const summativeSheet = subject?.summativeSheet;
  const cloSheet = subject?.cloSheet ?? null;
  const lectureLimit = subject?.lectureLimit ?? 22;

  const handoutCols: number[]       = subject?.lectureHandoutCols ?? [14, 15, 16];
  const videoCols: number[][]       = subject?.lectureVideoCols   ?? [[17,18],[19,20],[21,22]];
  const summaryCol: number | null   = subject?.lectureSummaryCol  ?? 23;
  const summCols: number[]          = subject?.summativeCols      ?? [13, 14, 15, 16];
  const summNames: string[]          = subject?.summativeNames     ?? ["Summative","SummativeKey","Summative 2","SummativeKey2"];
  const cloCols: number[]            = subject?.cloCols            ?? [];
  const cloNamesList: string[]      = subject?.cloNames           ?? [];
  const specialSheet                = subject?.specialSheet       ?? null;
  const specialRow: number          = subject?.specialRow         ?? 3;
  const specialCols: number[]       = subject?.specialCols        ?? [25, 26, 27, 28, 29];
  const specialNames: string[]      = subject?.specialNames       ?? ["Special 1","Special 2","Special 3","Special 4","Special 5"];

  // Fetch Lectures
  useEffect(() => {
    if (!sheetId || !lectureSheet) return;
    fetch(makeUrl(sheetId, lectureSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);
        const data = rows.map((row, rowIdx) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const number = cell(0), title = cell(1), type = cell(2);

          const handout = handoutCols.map((col, i) => ({
            name: `Handout ${i + 1}`, link: cell(col) as string | null, icon, col,
          }));

          const lectures = videoCols.map(([nameCol, linkCol], i) => ({
            name: (cell(nameCol) as string | null) ?? `Video ${i + 1}`,
            link: cell(linkCol) as string | null,
            icon, col: linkCol, nameCol, defaultName: `Video ${i + 1}`,
          }));

          const summary = summaryCol != null
            ? [{ name: "Summary", link: cell(summaryCol) as string | null, icon, col: summaryCol }]
            : [];

          if (!number || !title || !type) return null;
          return { number, title, type, handout, lectures, summary, sheetRow: rowIdx + rowOffset };
        }).filter(Boolean);
        setLectures(data);
      })
      .catch(console.error);
  }, [sheetId, lectureSheet, lectureLimit]);

  // Fetch Summative
  useEffect(() => {
    if (!sheetId || !summativeSheet) return;
    fetch(makeUrl(sheetId, summativeSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);
        const data = rows.map((row, rowIdx: number) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const title = cell(0);
          if (!title) return null;

          const handouts = summCols.map((col, idx) => ({
            name: summNames[idx] ?? `Slot ${idx + 1}`,
            link: convertDriveLink(cell(col) as string | null),
            icon, col,
          }));

          return { title, handouts, sheetRow: rowIdx + rowOffset };
        }).filter(Boolean);
        setSummativeList(data);
      })
      .catch(console.error);
  }, [sheetId, summativeSheet, lectureLimit]);

  // Fetch CLO
  useEffect(() => {
    if (!sheetId || !cloSheet || cloCols.length === 0) return;
    fetch(makeUrl(sheetId, cloSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);
        const data = rows.map((row, rowIdx: number) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const title = cell(0);
          if (!title) return null;

          const handouts = cloCols.map((col, idx) => ({
            name: cloNamesList[idx] ?? `CLO ${idx + 1}`,
            link: convertDriveLink(cell(col) as string | null),
            icon, col,
          }));

          return { title, handouts, sheetRow: rowIdx + rowOffset };
        }).filter(Boolean);
        setCloList(data);
      })
      .catch(console.error);
  }, [sheetId, cloSheet, lectureLimit]);

  // Fetch Special Materials — fixed row (specialRow), fixed cols (specialCols)
  useEffect(() => {
    if (!sheetId || !specialSheet) return;
    fetch(makeUrl(sheetId, specialSheet, specialRow + 2))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);
        const targetIdx = specialRow - rowOffset;
        const row = rows[targetIdx];
        const cell = (i) => row?.c?.[i]?.v ?? null;
        const handouts = specialCols.map((col, idx) => ({
          name: specialNames[idx] ?? `Special ${idx + 1}`,
          link: convertDriveLink(cell(col) as string | null),
          icon, col,
        }));
        setSpecialList([{ handouts, sheetRow: specialRow }]);
      })
      .catch(console.error);
  }, [sheetId, specialSheet]);

  if (!subject) return notFound();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Breadcrumb (ยกระดับด้วยความโปร่งใสแบบ Glassmorphism) */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md text-white sticky top-12 z-40 border-b border-slate-800 transition-all">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex gap-2 text-xs sm:text-sm tracking-wide font-medium">
          <div className="flex gap-2 items-center grow">
            <a className="hover:text-blue-400 text-slate-400 transition-colors" href="/academics">Academic</a>
            <span className="text-slate-600">/</span>
            <span className="text-blue-400 font-semibold">{subject.code}</span>
          </div>
        </div>
      </div>

      {/* Hero Header (ปรับเปลี่ยนมิติพื้นหลังและการจัดวางการ์ดภาพ) */}
      <div className="bg-gradient-to-b from-slate-100 via-white to-slate-50/30 border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="relative group mx-auto md:mx-0 w-full max-w-[260px] flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
              <Image
                src={subject.image}
                alt={subject.code}
                width={260}
                height={700}
                className="w-full h-[240px] object-cover object-top rounded-2xl shadow-md border border-slate-200/80 relative z-10 transform group-hover:scale-[1.02] transition-all duration-300"
              />
            </div>
            <div className="flex flex-col justify-center space-y-3 pt-1 text-center md:text-left">
              <span className="inline-block self-center md:self-start text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {subject.semester}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tight">
                {subject.code}
              </h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl font-medium leading-relaxed">{subject.title}</p>
              
              <div className="flex gap-3 items-center justify-center md:justify-start flex-wrap pt-3">
                {subject.canvasLink && (
                  <a href={subject.canvasLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 border border-slate-200 text-sm font-semibold rounded-xl py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                    <Image src="/CANVAS.png" alt="Canvas" width={22} height={14} className="object-contain" />
                    Canvas
                  </a>
                )}
                {subject.youtubeLink && (
                  <a href={subject.youtubeLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 border border-slate-200 text-sm font-semibold rounded-xl py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                    <Image src="/youtube.jpg" alt="YouTube" width={22} height={14} className="object-contain" />
                    Video By AcadTeam
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seniors + Special Material Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-12 space-y-10">
        
        {/* เว็บวิชาการรุ่นพี่ */}
        {subject.seniors?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">เว็บวิชาการรุ่นพี่</h2>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {subject.seniors.map(({ code, link, linkname }) => (
                <li key={code} className="group">
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center border border-slate-200/80 rounded-xl text-sm font-medium px-4 py-2 bg-white hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                    {linkname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Special Material */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full shadow-sm shadow-amber-500/50" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Special Material</h2>
          </div>
          <ul className="flex flex-wrap gap-3">
            {(specialList[0]?.handouts ?? specialCols.map((col, idx) => ({
              name: specialNames[idx] ?? `Special ${idx + 1}`,
              link: null, col, icon,
            }))).map((h, idx) => (
              <li key={idx} className="inline-flex items-center gap-2">
                {h.link ? (
                  <a href={h.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center border border-slate-200/80 rounded-xl text-sm font-medium px-4 py-2 bg-white hover:bg-amber-50/40 hover:text-amber-700 hover:border-amber-300 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                    {h.name}
                  </a>
                ) : isAdmin ? (
                  <span className="text-xs font-medium text-slate-400 border border-dashed border-slate-300 rounded-xl px-4 py-2 bg-slate-50/50">
                    {h.name}
                  </span>
                ) : null}
                {isAdmin && sheetId && specialSheet && (
                  <UploadButton
                    target={{ sheetId, sheetName: specialSheet, row: specialRow, col: h.col }}
                    existingLink={h.link}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lectures List Section (ครอบครอบด้วย Container ให้กว้างเท่ากันทั้งหมด) */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-12">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-1.5 h-5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400">Lectures Materials</h2>
        </div>
        <div className="flex flex-col gap-4">
          {lectures.map((lec, idx) => (
            <div key={idx} className="hover:-translate-y-0.5 transition-all duration-200">
              <LectureCard {...lec} sheetId={sheetId} sheetName={lectureSheet} />
            </div>
          ))}
        </div>
      </div>

      {/* CLO Section */}
      {cloList.length > 0 && (
        <div className="mt-16">
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-y border-emerald-500/10 py-6 mb-6">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center gap-3">
              <span className="w-2 h-7 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/40" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">CLO Assessment</h2>
            </div>
          </div>
          <div className="container mx-auto flex flex-col gap-4 px-4 sm:px-6 md:px-8">
            {cloList.map((lec, idx) => (
              <div key={idx} className="hover:-translate-y-0.5 transition-all duration-200">
                <SummativeCard {...lec} sheetId={sheetId} sheetName={cloSheet} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summative Section */}
      {summativeList.length > 0 && (
        <div className="mt-16">
          <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border-y border-violet-500/10 py-6 mb-6">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center gap-3">
              <span className="w-2 h-7 bg-violet-500 rounded-full shadow-sm shadow-violet-500/40" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Summative Examination</h2>
            </div>
          </div>
          <div className="container mx-auto flex flex-col gap-4 px-4 sm:px-6 md:px-8">
            {summativeList.map((lec, idx) => (
              <div key={idx} className="hover:-translate-y-0.5 transition-all duration-200">
                <SummativeCard {...lec} sheetId={sheetId} sheetName={summativeSheet} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}
