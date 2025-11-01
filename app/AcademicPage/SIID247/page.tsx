"use client";

import React, { useEffect, useState } from 'react';
import LectureCard from "../../components/AcademicComponent";
import SummativeCard from "../../components/SummativeComponent";
import CLOCard from "../../Components/CLOCard";
import Image from "next/image";

const SIID247 = () => {
  const [lectures, setLectures] = useState([]);
  const [summativeList, setSummativeList] = useState([]);
  const [CLOList, setCLOlist] = useState([]);

  const parseGViz = (text) => JSON.parse(text.substring(47).slice(0, -2)).table.rows;

  const url = `https://docs.google.com/spreadsheets/d/1BycR2oOEWS5FlGe5KZLcwm6nPuCpHvmn8p-3SCo3rcg/gviz/tq?tqx=out:json&sheet=247%20(CVS)&tq=select%20*%20limit%2022`;
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
              const name ="Handout";
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

  // ✅ ดึงข้อมูล Summative
  useEffect(() => {
    fetch(sumUrl)
      .then((res) => res.text())
      .then((text) => {
        const rows = parseGViz(text);

        const convertDriveLink = (url) => {
          const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (!match) return url;
          return `https://drive.google.com/file/d/${match[1]}/preview`;
        };

        const data = rows
          .map((row) => {
            const cell = (i) => row.c?.[i]?.v ?? null;
            const title = cell(0);
            if (!title) return null;

            const handouts = [13, 14, 15, 16]
              .map((i, idx) => {
                const name = ["Summative", "SummativeKey", "Summative 2", "SummativeKey2"][idx];
                const link = cell(i);
                return link ? { name, link: convertDriveLink(link), icon } : null;
              })
              .filter(Boolean);

            if (handouts.length === 0) return null;
            return { title, handouts };
          })
          .filter(Boolean);

        setSummativeList(data);
      })
      .catch((err) => console.error("Error fetching summative:", err));
  }, []);
  
 useEffect(() => {
  fetch(sumUrl)
    .then((res) => res.text())
    .then((text) => {
      const rows = parseGViz(text);


      const data = rows
        .map((row) => {
          const cell = (i) => row.c?.[i]?.v ?? null;
          const title = cell(0);
          if (!title) return null;

          const name = cell(25);
          const link = cell(26);

          if (!link) return null;

          const CLO = [
            {
              name,
              link,
              icon: "📄", // ใส่ icon ที่ต้องการได้
            },
          ];

          return { title, CLO };
        })
        .filter(Boolean);

      setCLOlist(data);
    })
    .catch((err) => console.error("Error fetching CLO:", err));
}, [sumUrl]);


  // ✅ ข้อมูลเว็บรุ่นพี่
  const courses = [
    { code: 'SI134', link: 'https://siriraj134.com/acad/siid247', linkname: 'SI134(247)' },
    { code: 'SI133', link: 'https://sites.google.com/view/siriraj133official/archives/year-2/siid-247', linkname: 'SI133(247)' },
    { code: 'SI132', link: 'https://sites.google.com/view/siriraj132/archives/year-2/siid247', linkname: 'SI132(247)' },
    { code: 'SI131', link: 'https://sites.google.com/view/siriraj131official/archives/sophomore/217', linkname: 'SI131(217)' },
    { code: 'SI130', link: 'https://sites.google.com/view/siriraj130/archives/year-2/217', linkname: 'SI130(217)' },
    { code: 'SI129', link: 'https://sites.google.com/view/si129academicportal/archive/sophomore/217', linkname: 'SI129(217)' },
    { code: 'SI128', link: 'https://sites.google.com/view/siriraj128/217', linkname: 'SI128(217)' },
  ];

  return (
    <>
      {/* breadcrumb */}
      <div className="mt-8 w-full bg-black text-white sticky top-12 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-2 flex gap-2 font-preuksa">
          <div className="flex gap-2 items-center grow">
            <a className="hover:underline" href="/academics">Academic</a>
            <span>/</span>
            <span>SIID247</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center rounded-lg mt-10">
          <Image
            src="/SIID247.png"
            alt="SIID247"
            width={300}
            height={800}
            className="w-full md:w-[300px] h-[250px] object-cover object-top rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0"
          />
          <div className="text-left space-y-1 font-preuksa">
            <p className="text-xl font-bold text-gray-900 tracking-wide">Year 2 Semester 1</p>
            <p className="text-3xl text-gray-700 italic">SIID247</p>
            <p className="text-base text-gray-600">Circulatory System</p>
            <div className="flex gap-2 items-center flex-wrap">
              <a
                href="https://sirirajcanvas.instructure.com/courses/1078"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-400 text-lg rounded-lg py-1 px-2 w-fit bg-gradient-to-r from-gray-200 to-gray-300 hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                <Image src="/CANVAS.png" alt="SI Canvas Logo" width={34} height={20} className="inline" />
                Canvas
              </a>
               <a
                href="https://www.youtube.com/playlist?app=desktop&list=PLnWAv0tkYmKGjolHgkric3CR4SZHLydb6"
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

      {/* Senior course links */}
      <div className="mt-4 font-semibold text-2xl container mx-auto px-4 sm:px-6 md:px-8">เว็บวิชาการรุ่นพี่</div>
      <ul className="flex flex-wrap gap-4 mt-4 px-4 sm:px-6 md:px-8">
        {courses.map(({ code, link, linkname }) => (
          <li key={code}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 hover:bg-slate-200 transition-colors"
            >
              {linkname}
            </a>
          </li>
        ))}
      </ul>

      {/* Lectures */}
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
        {lectures.map((lec, idx) => (
          <LectureCard key={idx} {...lec} />
        ))}
      </div>
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 mt-8">
         {CLOList.map((lec, idx) => (
            <CLOCard key={idx} {...lec} />
          ))}
        ))}
      </div>
       

      {/* Summative */}
      <div className="mx-auto">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 shadow-md py-7 mt-5">
          <div className="w-full text-left px-4 text-3xl font-bold text-sky-900">Summative Examination</div>
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

export default SIID247;
