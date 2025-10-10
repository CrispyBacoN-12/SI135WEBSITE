"used client";
import Link from "next/link";
import Image from "next/image";

const ChangePage = () => {
  const ToSIID243 = () => {

  }
}
const courses = [
{ code: "SIID243", href: "/AcademicPage/SIID243", src: "/SIID243.jpg" },
{ code: "SIID245", href: "/AcademicPage/SIID245", src: "/SIID245.png" },
{ code: "SIID246", href: "/AcademicPage/SIID246", src: "/SIID246.png" },
{ code: "SIID254", href: "/AcademicPage/SIID254", src: "/SIID254.jpg" },
{ code:"SIID255" , herf: "/AcademicPage/SIID255", src: "/SIID255.png" }
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


{/* Section banner */}
<div className="mt-8 bg-gradient-to-r from-sky-100 to-yellow-100 shadow-md">
<div className="w-full max-w-6xl mx-auto text-center font-semibold text-2xl md:text-3xl py-4">
Year2 Semester 2
</div>
</div>
</div>
    </>

  );
}
