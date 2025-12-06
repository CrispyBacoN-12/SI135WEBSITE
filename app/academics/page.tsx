"used client";
import Link from "next/link";
import Image from "next/image";
import CourseGrid from './components/CourseGrid';

const ChangePage = () => {
  const ToSIID243 = () => {

  }
}
const coursesY2S1 = [
{ code: "SIID243", href: "/AcademicPage/SIID243", src: "/SIID243.png" },
  { code: "SIID244", href: "/AcademicPage/SIID244", src: "/SIID244.png" },
{ code: "SIID245", href: "/AcademicPage/SIID245", src: "/SIID245.png" },
{ code: "SIID246", href: "/AcademicPage/SIID246", src: "/SIID246.png" },
  { code: "SIID247", href: "/AcademicPage/SIID247", src: "/SIID247.png" },
  { code: "SIID248", href: "/AcademicPage/SIID248", src: "/SIID248.png" },
  { code: "SIID251", href: "/AcademicPage/SIID251", src: "/SIID251.png" },
{ code: "SIID254", href: "/AcademicPage/SIID254", src: "/SIID254.png" },
{ code: "SIID255", href: "/AcademicPage/SIID255", src: "/SIID255.png" },

];
const coursesY2S2 = [
{ code: "SIID249", href: "/AcademicPage/SIID249", src: "/SIID249.png" },
{ code: "SIID250", href: "/AcademicPage/SIID250", src: "/SIID250.png" },
{ code: "SIID252", href: "/AcademicPage/SIID252", src: "/SIID252.png" },
  { code: "SIID253", href: "/AcademicPage/SIID253", src: "/SIID253.png" },
  { code: "SIID256", href: "/AcademicPage/SIID256", src: "/SIID256.png" },
  { code: "SIID257", href: "/AcademicPage/SIID257", src: "/SIID257.png" },
  { code: "SIID258", href: "/AcademicPage/SIID258", src: "/SIID258.png" },
  { code: "SIID259", href: "/AcademicPage/SIID259", src: "/SIID259.png" },
  { code: "SIID260", href: "/AcademicPage/SIID260", src: "/SIID260.png" },

];
const coursesY1S1 = [
{ code: "SIID143", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/siid-143?authuser=0", src: "/SIID143.png" },
  { code: "SIID144", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/siid-144?authuser=0", src: "/SIID144.png" },
{ code: "SIID145", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s2/siid-145?authuser=0", src: "/SIID145.png" },
{ code: "SIID146", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/siid-146?authuser=0", src: "/SIID146.png" },
  { code: "SCID104", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/scid-104?authuser=0", src: "/SCID104.png" },
  { code: "EGID103", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/egid-103?authuser=08", src: "/EGID103.png" },
  { code: "ITCS152", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s1/itcs-152?authuser=0", src: "/ITCS152.png" },
];
const coursesY1S2 = [
{ code: "SIID145", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s2/siid-145?authuser=0", src: "/SIID145.png" },
  { code: "SIID147", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s2/siid-147?authuser=0", src: "/SIID147.jpg" },
  { code: "SIID148", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s2/siid-148?authuser=0", src: "/SIID148.jpg" },
  { code: "SCID105", href: "https://sites.google.com/student.mahidol.edu/siriraj135/archieve/year1/y1s2/scid-105?authuser=0", src: "/SCID105.jpg" },
];
export default function Academics() {
  return (
    <>
      <div className="w-full px-6 py-4 highlight font-semibold text-2xl ">
        Academics site
      </div>
      <div className="flex flex-wrap items-center 
                px-2 sm:px-4 md:px-6 
                space-x-1 sm:space-x-2 md:space-x-4 
                font-semibold pb-4 md:pb-6">
        <a
          href="https://sites.google.com/view/siriraj128/news-feed"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI128
        </a>
        <a
          href="https://sites.google.com/view/si129academicportal/home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI129
        </a>
        <a
          href="https://sites.google.com/view/siriraj130/home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI130
        </a>
        <a
          href="https://sites.google.com/view/siriraj131official/home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI131
        </a>
        <a
          href="https://sites.google.com/view/siriraj132/home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI132
        </a>
        <a
          href="https://sites.google.com/view/siriraj133official/home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI133
        </a>
        <a
          href="https://siriraj134.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center border border-slate-400 rounded-lg text-sm w-fit px-4 py-2 bg-transparent hover:bg-slate-200 transition-colors">
          SI134
        </a>
      </div>
     
      {/* Year2 Semester 2 */}
      <div className="container w-full max-w-screen-2xl mx-auto text-3xl py-4 px-0 text-center font-semibold ">
        Year2 Semester 2 
      </div>
      <CourseGrid courses={coursesY2S2} /> {/* ใช้ component ที่สร้างขึ้น */}

      {/* Year2 Semester 1 */}
      <div className="container w-full max-w-screen-2xl mx-auto text-3xl py-4 px-0 text-center font-semibold ">
        Year2 Semester 1 
      </div>
      <CourseGrid courses={coursesY2S1} /> {/* ใช้ component ที่สร้างขึ้น */}


      {/* Year1 Semester 2 */}
      <div className="mt-8 bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
        <div className="w-full max-w-6xl mx-auto text-center font-semibold text-2xl md:text-3xl py-4">
          Year1 Semester 2
        </div>
      </div>
      <CourseGrid courses={coursesY1S2} /> {/* ใช้ component ที่สร้างขึ้น */}

      {/* Year1 Semester 1 */}
      <div className="mt-8 bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
        <div className="w-full max-w-6xl mx-auto text-center font-semibold text-2xl md:text-3xl py-4">
          Year1 Semester 1
        </div>
      </div>
      <CourseGrid courses={coursesY1S1} /> {/* ใช้ component ที่สร้างขึ้น */}
    </>
  );
}
