"used client";
import Link from "next/link";
import Image from "next/image";

const ChangePage = () => {
  const ToSIID243 = () => {

  }
}
const courses = [
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
      <div className="bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
      <div className="container w-full max-w-screen-2xl mx-auto text-3xl py-4 px-0 text-center font-semibold ">
        Year2 Semester 1 </div>
    </div>
      <div className="w-full py-6">
{/* Card grid */}
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
{courses.map(({ code, href, src }) => (
<li key={code} className="group">
<a
href={href}
className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
>
<div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
  {/* Image wrapper with responsive aspect ratio */}
  <div className="relative aspect-square md:aspect-[4/3]">
    <img
      src={src}
      alt={code}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* Label */}
  <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
    {code}
  </span>
</div>

</a>
</li>
))}
</ul>
        </div>


{/* Section banner */}
<div className="mt-8 bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
<div className="w-full max-w-6xl mx-auto text-center font-semibold text-2xl md:text-3xl py-4">
Year1 Semester 2
</div>
</div>
         <div className="w-full py-6">
{/* Card grid */}
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
{coursesY1S2.map(({ code, href, src }) => (
<li key={code} className="group">
<a
href={href}
className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
>
<div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
  {/* Image wrapper with responsive aspect ratio */}
  <div className="relative aspect-square md:aspect-[4/3]">
    <img
      src={src}
      alt={code}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top object-right transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* Label */}
  <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
    {code}
  </span>
</div>

</a>
</li>
))}
</ul>
</div>
      <div className="mt-8 bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
<div className="w-full max-w-6xl mx-auto text-center font-semibold text-2xl md:text-3xl py-4">
Year1 Semester 1
</div>
</div>
         <div className="w-full py-6">
{/* Card grid */}
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
{coursesY1S1.map(({ code, href, src }) => (
<li key={code} className="group">
<a
href={href}
className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
>
<div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
  {/* Image wrapper with responsive aspect ratio */}
  <div className="relative aspect-square md:aspect-[4/3]">
    <img
      src={src}
      alt={code}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-top object-right transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* Label */}
  <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
    {code}
  </span>
</div>

</a>
</li>
))}
</ul>
</div>
    </>

  );
}
