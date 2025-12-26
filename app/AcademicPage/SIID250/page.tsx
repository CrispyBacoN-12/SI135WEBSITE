"use client";

import React, { useEffect, useState } from "react";
import LectureCard from "../../components/AcademicComponent"; // แสดง Lecture
import SummativeCard from "../../components/SummativeComponent"; // แสดง Summative / CLO
import Image from "next/image";

type GVizCell = { v?: any } | null;
type GVizRow = { c?: GVizCell[] };

type LinkItem = {
  name: string;
  link: string;
  icon?: React.ReactNode;
};

type LectureItem = {
  number: string | number;
  title: string;
  type: string;
  handout: LinkItem[];
  lectures: LinkItem[];
  summary: LinkItem[];
};

type SummativeItem = {
  title: string;
  handouts: LinkItem[];
};

const SIID250 = () => {
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [summativeList, setSummativeList] = useState<SummativeItem[]>([]);
  const [CLOASSESSMENT, setCLOASSESSMENT] = useState<SummativeItem[]>([]);

  // ✅ icon เคยหาย (ทำให้ build error) — รวมไว้ที่เดียว ใช้ได้ทุก map
  const icon = (
    <svg className="w-4 h-4 mr-1 inline" viewBox="0 0 448 512" fill="currentColor">
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
    </svg>
  );

  // ✅ parse gviz แบบทนกว่า substring fix-index
  const parseGViz = (text: string): GVizRow[] => {
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match?.[1]) return [];
    const json = JSON.parse(match[1]);
    return json?.table?.rows ?? [];
  };

  const convertDriveLink = (url: string) => {
    if (!url) return url;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return url;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  };

  // ✅ sheet name มีวงเล็บ ต้อง encode (%28 %29) ไม่งั้นบางครั้ง fetch พัง
  const base =
    "https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json";
  const url = `${base}&sheet=250%20%28GI%29&tq=select%20*`;
  const sumUrl = `${base}&sheet=Summative3&tq=select%20*`;
  const CLOUrl = `${base}&sheet=CLO&tq=select%20*`;

  // ✅ Lectures
  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseGViz(text);

        const data: LectureItem[] = rows
          .map((row) => {
            const cell = (i: number) => (row.c?.[i] as any)?.v ?? null;

            const number = cell(0);
            const title = cell(1);
            const type = cell(2);

            // handouts (col 14-16)
            const handout: LinkItem[] = [];
            for (let i = 14; i <= 16; i++) {
              const link = cell(i);
              if (link) handout.push({ name: "Handout", link: String(link), icon });
            }

            // lecture links (name, link) pairs: (17,18) (19,20) (21,22)
            const lectureLinks: LinkItem[] = [];
            for (let i = 17; i <= 21; i += 2) {
              const name = cell(i);
              const link = cell(i + 1);
              if (name && link)
                lectureLinks.push({ name: String(name), link: String(link), icon });
            }

            // summary (col 23)
            const summaryLink = cell(23);
            const summary: LinkItem[] = summaryLink
              ? [{ name: "Summary", link: String(summaryLink), icon }]
              : [];

            if (!number || !title || !type) return null;

            return {
              number,
              title: String(title),
              type: String(type),
              handout,
              lectures: lectureLinks,
              summary,
            };
          })
          .filter(Boolean) as LectureItem[];

        setLectures(data);
      })
      .catch((err) => console.error("Error fetching lectures:", err));
  }, []);

  // ✅ Summative
  useEffect(() => {
    fetch(sumUrl)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseGViz(text);

        const data: SummativeItem[] = rows
          .map((row) => {
            const cell = (i: number) => (row.c?.[i] as any)?.v ?? null;

            const title = cell(0);
            if (!title) return null;

            const handouts = [13, 14, 15, 16]
              .map((colIdx, idx) => {
                const name = ["Summative", "SummativeKey", "Summative 2", "SummativeKey2"][idx];
                const link = cell(colIdx);
                return link ? { name, link: convertDriveLink(String(link)), icon } : null;
              })
              .filter(Boolean) as LinkItem[];

            if (handouts.length === 0) return null;
            return { title: String(title), handouts };
          })
          .filter(Boolean) as SummativeItem[];

        setSummativeList(data);
      })
      .catch((err) => console.error("Error fetching summative:", err));
  }, []);

  // ✅ CLO Assessment
  useEffect(() => {
    fetch(CLOUrl)
      .then((r) => r.text())
      .then((t) => {
        const rows = parseGViz(t);

        const data: SummativeItem[] = rows
          .map((row) => {
            const cell = (i: number) => (row.c?.[i] as any)?.v ?? null;

            const title = cell(0);
            const handouts: LinkItem[] = [];

            const CLO1Q = cell(3);
            if (CLO1Q) handouts.push({ name: "Question", link: convertDriveLink(String(CLO1Q)), icon });

            const CLO1A = cell(4);
            if (CLO1A) handouts.push({ name: "Answer", link: convertDriveLink(String(CLO1A)), icon });

            const CLO2Q = cell(5);
            if (CLO2Q) handouts.push({ name: "Question2", link: convertDriveLink(String(CLO2Q)), icon });

            const CLO2A = cell(6);
            if (CLO2A) handouts.push({ name: "Answer2", link: convertDriveLink(String(CLO2A)), icon });

            const CLO3Q = cell(7);
            if (CLO3Q) handouts.push({ name: "Question3", link: convertDriveLink(String(CLO3Q)), icon });

            const CLO3A = cell(8);
            if (CLO3A) handouts.push({ name: "Answer3", link: convertDriveLink(String(CLO3A)), icon });

            if (!title || handouts.length === 0) return null;
            return { title: String(title), handouts };
          })
          .filter(Boolean) as SummativeItem[];

        setCLOASSESSMENT(data);
      })
      .catch((e) => console.error("fetch CLO failed:", e));
  }, []);

  const courses = [
    { code: "SI134", link: "https://siriraj134.com/acad/siid250", linkname: "SI134(250)" },
    { code: "SI133", link: "https://sites.google.com/view/siriraj133official/archives/year-2/siid-250", linkname: "SI133(250)" },
    { code: "SI132", link: "https://sites.google.com/view/siriraj132/archives/year-2/siid250", linkname: "SI132(250)" },
    { code: "SI131", link: "https://sites.google.com/view/siriraj131official/archives/sophomore/220", linkname: "SI131(220)" },
    { code: "SI130", link: "https://sites.google.com/view/siriraj130/archives/year-2/220", linkname: "SI130(220)" },
    { code: "SI129", link: "https://sites.google.com/view/si129academicportal/archive/sophomore/220", linkname: "SI129(220)" },
    { code: "SI128", link: "https://sites.google.com/view/siriraj128/220", linkname: "SI128(220)" },
  ];

  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">
              Academic
            </a>
            <span>/</span>
            <span>SIID250</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID 250.png"
            alt="SIID250"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover object-top rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide highlight">Year 2 Semester 2</p>
            <p className="text-3xl text-gray-700 italic">SIID250</p>
            <p className="text-base text-gray-600">Gastrointestinal and Hepatobiliary System</p>

            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1065"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 bg-transparent hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image src="/CANVAS.png" alt="SI Canvas Logo" width={34} height={20} className="inline" />
                Canvas
              </a>

              <a
                href="https://www.youtube.com/playlist?list=PLnWAv0tkYmKHzjMLs3ukwFxm0ga0geL7R"
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

      <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8">เว็บวิชาการรุ่นพี่</div>
      <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8">
        {courses.map(({ code, link, linkname }) => (
          <li key={code}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors"
            >
              {linkname}
            </a>
          </li>
        ))}
      </ul>

      {/* Lectures Section */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => (
          <LectureCard key={idx} {...lec} />
        ))}
      </div>

      {/* CLO Section */}
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-4">
          <div className="w-full text-left px-4 text-3xl font-bold text-sky-900 focus:outline-none">
            CLO ASSESSMENT
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
          {CLOASSESSMENT.map((item, idx) => (
            <SummativeCard key={idx} {...item} />
          ))}
        </div>
      </div>

      {/* Summative Section */}
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-4">
          <div className="w-full text-left px-4 text-3xl font-bold text-sky-900 focus:outline-none">
            Summative Examination
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-8">
          {summativeList.map((item, idx) => (
            <SummativeCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SIID250;
