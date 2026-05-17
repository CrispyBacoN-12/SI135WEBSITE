"use client";

import React, { useEffect, useState } from "react";
import { subjectsConfig } from "../data/subjectsConfig";
import SectionCard from "./Section";
import SummativeCard from "./SummativeComponent";
import { useAdmin } from "./AdminContext";
import UploadButton from "./UploadButton";
import Image from "next/image";
import { notFound } from "next/navigation";

const parseGViz = (text) => {
  const table = JSON.parse(text.substring(47).slice(0, -2)).table;
  const rowOffset = (table.parsedNumHeaders ?? 0) + 1;
  return { rows: table.rows, rowOffset };
};

const icon = (
  <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 448 512">
    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448
    c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
  </svg>
);

const convertDriveLink = (url) => {
  const match = url?.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
};

const makeUrl = (sheetId, sheet, limit) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&tq=select%20*%20limit%20${limit}`;

export default function LabPage({ code }: { code: string }) {
  const subject = subjectsConfig[code];
  const { isAdmin } = useAdmin();

  const [sections, setSections] = useState([]);
  const [summativeList, setSummativeList] = useState([]);
  const [specialList, setSpecialList] = useState([]);

  if (!subject) return notFound();

  const sheetId          = subject.sheetId;
  const lectureSheet     = subject.lectureSheet;
  const lectureLimit     = subject.lectureLimit ?? 50;
  const summativeSheet   = subject.summativeSheet;
  const summCols: number[]   = subject.summativeCols ?? [];
  const summNames: string[]  = subject.summativeNames ?? [];
  const handoutCols: number[]  = subject.lectureHandoutCols ?? [];
  const handoutNames: string[] = subject.lectureHandoutNames ?? handoutCols.map((_, i) => `Handout ${i + 1}`);
  const videoCols: number[][]  = subject.lectureVideoCols ?? [];
  const summaryCol: number | null = subject.lectureSummaryCol ?? null;
  const labSections: string[]  = subject.labSections ?? [];
  const labTrigger: number     = subject.labTrigger ?? 1;
  const specialSheet       = subject.specialSheet ?? null;
  const specialRow: number = subject.specialRow ?? 3;
  const specialCols: number[]  = subject.specialCols ?? [25, 26, 27, 28, 29];
  const specialNames: string[] = subject.specialNames ?? ["Special 1", "Special 2", "Special 3", "Special 4", "Special 5"];

  // Fetch lab sessions and group into anatomical sections
  useEffect(() => {
    if (!sheetId || !lectureSheet) return;
    fetch(makeUrl(sheetId, lectureSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);

        const allLectures = rows.map((row, rowIdx) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const number = Number(cell(1)); // col 1 = session number
          const title = cell(2);         // col 2 = title
          if (!title) return null;

          const handout = handoutCols.map((col, i) => ({
            name: handoutNames[i] ?? `Handout ${i + 1}`,
            link: cell(col) as string | null,
            icon, col,
          }));

          const lectures = videoCols.map(([nameCol, linkCol], i) => ({
            name: (cell(nameCol) as string | null) ?? `Video ${i + 1}`,
            link: cell(linkCol) as string | null,
            icon, col: linkCol, nameCol, defaultName: `Video ${i + 1}`,
          }));

          const summary = summaryCol != null
            ? [{ name: "Summary", link: cell(summaryCol) as string | null, icon, col: summaryCol }]
            : [];

          return { number, title, type: "LAB", handout, lectures, summary, sheetRow: rowIdx + rowOffset };
        }).filter(Boolean);

        // Group into anatomical sections: new section starts when number === labTrigger
        let sectionIndex = -1;
        let current = null;
        const grouped = [];

        for (const lec of allLectures) {
          if (lec.number === labTrigger || !current) {
            sectionIndex += 1;
            current = {
              id: sectionIndex,
              name: labSections[sectionIndex] || `Section ${sectionIndex + 1}`,
              lectures: [],
            };
            grouped.push(current);
          }
          current.lectures.push(lec);
        }

        setSections(grouped);
      })
      .catch(console.error);
  }, [sheetId, lectureSheet]);

  // Fetch Summative
  useEffect(() => {
    if (!sheetId || !summativeSheet) return;
    fetch(makeUrl(sheetId, summativeSheet, 50))
      .then((r) => r.text())
      .then((text) => {
        const { rows, rowOffset } = parseGViz(text);
        const data = rows.map((row, rowIdx) => {
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
  }, [sheetId, summativeSheet]);

  // Fetch Special Materials (fixed row)
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full bg-black text-white sticky top-12 z-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <a className="hover:underline text-gray-400" href="/academics">Academic</a>
            <span className="text-gray-600">/</span>
            <span className="font-medium">{subject.code}</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-start gap-7">
            <Image
              src={subject.image}
              alt={subject.code}
              width={260}
              height={700}
              className="w-full md:w-[260px] h-[220px] object-cover object-top rounded-2xl shadow-lg flex-shrink-0"
            />
            <div className="flex flex-col justify-center space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">{subject.semester}</span>
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">{subject.code}</h1>
              <p className="text-base text-gray-500 max-w-xl leading-relaxed">{subject.title}</p>
              <div className="flex gap-2 items-center flex-wrap pt-2">
                {subject.canvasLink && (
                  <a href={subject.canvasLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-slate-200 text-sm rounded-xl py-1.5 px-3 bg-white hover:bg-slate-50 shadow-sm transition-all">
                    <Image src="/CANVAS.png" alt="Canvas" width={26} height={16} />
                    Canvas
                  </a>
                )}
                {subject.youtubeLink && (
                  <a href={subject.youtubeLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-slate-200 text-sm rounded-xl py-1.5 px-3 bg-white hover:bg-slate-50 shadow-sm transition-all">
                    <Image src="/youtube.jpg" alt="YouTube" width={26} height={16} />
                    Video By AcadTeam
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seniors + Special Material */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mt-8 space-y-6">
        {subject.seniors?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-5 bg-blue-400 rounded-full" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">เว็บวิชาการรุ่นพี่</h2>
            </div>
            <ul className="flex flex-wrap gap-2">
              {subject.seniors.map(({ code, link, linkname }) => (
                <li key={code}>
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center border border-slate-200 rounded-lg text-sm px-4 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 shadow-sm transition-all">
                    {linkname}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-5 bg-amber-400 rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Special Material</h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {(specialList[0]?.handouts ?? specialCols.map((col, idx) => ({
              name: specialNames[idx] ?? `Special ${idx + 1}`,
              link: null, col, icon,
            }))).map((h, idx) => (
              <li key={idx} className="inline-flex items-center gap-1">
                {h.link ? (
                  <a href={h.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center border border-slate-200 rounded-lg text-sm px-4 py-1.5 bg-white hover:bg-amber-50 hover:border-amber-300 shadow-sm transition-all">
                    {h.name}
                  </a>
                ) : isAdmin ? (
                  <span className="text-xs text-gray-400 border border-dashed border-gray-200 rounded px-2 py-1.5">{h.name}</span>
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

      {/* Lab Sections */}
      <div className="mt-10">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-green-400 rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Lab Sessions</h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 md:px-8">
          {sections.map((sec, idx) => (
            <SectionCard key={idx} name={sec.name} lectures={sec.lectures} sheetId={sheetId} sheetName={lectureSheet} />
          ))}
        </div>
      </div>

      {/* Summative */}
      {summativeList.length > 0 && (
        <div className="mt-12">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-y border-violet-100 py-5">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-violet-400 rounded-full" />
              <h2 className="text-2xl font-bold text-slate-800">Summative Examination</h2>
            </div>
          </div>
          <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8 mt-4">
            {summativeList.map((item, idx) => (
              <SummativeCard key={idx} {...item} sheetId={sheetId} sheetName={summativeSheet} />
            ))}
          </div>
        </div>
      )}

      <div className="h-16" />
    </>
  );
}
