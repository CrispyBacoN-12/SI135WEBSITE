"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { subjectsConfig } from "app/data/subjectsConfig";
import LectureCard from "../../components/AcademicComponent";
import SummativeCard from "../../components/SummativeComponent";
import Image from "next/image";
import { notFound } from "next/navigation";

const parseGViz = (text) =>
  JSON.parse(text.substring(47).slice(0, -2)).table.rows;

const icon = (
  <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 448 512">
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

  const [lectures, setLectures] = useState([]);
  const [summativeList, setSummativeList] = useState([]);
  const [cloList, setCloList] = useState([]);

  if (!subject) return notFound();

  const { sheetId, lectureSheet, summativeSheet, cloSheet, lectureLimit = 22 } = subject;

  // Fetch Lectures
  useEffect(() => {
    fetch(makeUrl(sheetId, lectureSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const rows = parseGViz(text);
        const data = rows.map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const number = cell(0), title = cell(1), type = cell(2);

          const handout = [];
          for (let i = 14; i <= 16; i++) {
            const link = cell(i);
            if (link) handout.push({ name: "Handout", link, icon });
          }

          const lectureLinks = [];
          for (let i = 17; i <= 22; i += 2) {
            const name = cell(i), link = cell(i + 1);
            if (name && link) lectureLinks.push({ name, link, icon });
          }

          const summaryLink = cell(23);
          const summary = summaryLink ? [{ name: "Summary", link: summaryLink, icon }] : [];

          if (!number || !title || !type) return null;
          return { number, title, type, handout, lectures: lectureLinks, summary };
        }).filter(Boolean);
        setLectures(data);
      })
      .catch(console.error);
  }, [sheetId, lectureSheet]);

  // Fetch Summative
  useEffect(() => {
    fetch(makeUrl(sheetId, summativeSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const rows = parseGViz(text);
        const data = rows.map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const title = cell(0);
          if (!title) return null;

          const names = ["Summative", "SummativeKey", "Summative 2", "SummativeKey2"];
          const handouts = [13, 14, 15, 16]
            .map((i, idx) => {
              const link = cell(i);
              return link ? { name: names[idx], link: convertDriveLink(link), icon } : null;
            })
            .filter(Boolean);

          return handouts.length ? { title, handouts } : null;
        }).filter(Boolean);
        setSummativeList(data);
      })
      .catch(console.error);
  }, [sheetId, summativeSheet]);

  // Fetch CLO
  useEffect(() => {
    fetch(makeUrl(sheetId, cloSheet, lectureLimit))
      .then((r) => r.text())
      .then((text) => {
        const rows = parseGViz(text);
        const cloFields = [
          { col: 3, name: "Question" }, { col: 4, name: "Answer" },
          { col: 5, name: "Question2" }, { col: 6, name: "Answer2" },
          { col: 7, name: "Question3" }, { col: 8, name: "Answer3" },
        ];
        const data = rows.map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const title = cell(0);
          const handouts = cloFields
            .map(({ col, name }) => {
              const link = cell(col);
              return link ? { name, link: convertDriveLink(link), icon } : null;
            })
            .filter(Boolean);

          return title && handouts.length ? { title, handouts } : null;
        }).filter(Boolean);
        setCloList(data);
      })
      .catch(console.error);
  }, [sheetId, cloSheet]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>{subject.code}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src={subject.image}
            alt={subject.code}
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover object-top rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1">
            <p className="text-xl font-bold text-gray-900">{subject.semester}</p>
            <p className="text-3xl text-gray-700 italic">{subject.code}</p>
            <p className="text-base text-gray-600">{subject.title}</p>
            <div className="flex gap-2 items-center flex-wrap">
              {subject.canvasLink && (
                <a href={subject.canvasLink} target="_blank" rel="noopener noreferrer"
                  className="border border-slate-400 text-lg rounded-lg py-1 px-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:bg-slate-200 transition-colors flex items-center gap-1">
                  <Image src="/CANVAS.png" alt="Canvas" width={34} height={20} className="inline" />
                  Canvas
                </a>
              )}
              {subject.youtubeLink && (
                <a href={subject.youtubeLink} target="_blank" rel="noopener noreferrer"
                  className="border border-slate-400 text-lg rounded-lg py-1 px-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:bg-slate-200 transition-colors flex items-center gap-1">
                  <Image src="/youtube.jpg" alt="YouTube" width={34} height={20} className="inline" />
                  Video By AcadTeam
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seniors */}
      {subject.seniors?.length > 0 && (
        <>
          <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8">เว็บวิชาการรุ่นพี่</div>
          <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8">
            {subject.seniors.map(({ code, link, linkname }) => (
              <li key={code}>
                <a href={link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 hover:bg-slate-200 transition-colors">
                  {linkname}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Lectures */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => <LectureCard key={idx} {...lec} />)}
      </div>

      {/* CLO */}
      {cloList.length > 0 && (
        <div className="mx-auto">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-4">
            <div className="w-full text-left px-4 text-3xl font-bold text-sky-900">CLO ASSESSMENT</div>
          </div>
          <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
            {cloList.map((lec, idx) => <SummativeCard key={idx} {...lec} />)}
          </div>
        </div>
      )}

      {/* Summative */}
      {summativeList.length > 0 && (
        <div className="mx-auto">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-5">
            <div className="w-full text-left px-4 text-3xl font-bold text-sky-900">Summative Examination</div>
          </div>
          <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
            {summativeList.map((lec, idx) => <SummativeCard key={idx} {...lec} />)}
          </div>
        </div>
      )}
    </>
  );
}
