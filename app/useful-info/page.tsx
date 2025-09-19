export default function StudentImpact ()
{
    const courses= [
      {code:"Shuttle Bus ม.มหิดล",src:"BUS.jpg",link:"https://op.mahidol.ac.th/ga/shuttle-bus/"}
      ,{code:"รถBUSวิ่งในศิริราช",src:"EV BUS.png",link:"components/EVBUS"}
      ,{code:"เรือด่วนเจ้าพระยา",src:"BOAT.png",link:"https://www.chaophrayaexpressboat.com/chaophrayaexpressboat"}
    ]
    const courses2= [
      {code:"MU One Stop Service",src:"Paper.png",link:"https://mustudent.mahidol.ac.th/2022/07/25376/"}
      ,{code:"ระบบขอเอกสารสำคัญ ศิริราช",src:"Paper2.png",link:"https://script.google.com/macros/s/AKfycbxbSZ9IGW5uPUc5Idv0upr5zuqz2154dGntjSTAEh2z93cqaY5oduZL6VeGKhFmvyr_yQ/exec"}
      ,{code:"การลาเรียน",src:"BOAT.png",link:"https://www.chaophrayaexpressboat.com/chaophrayaexpressboat"}
      ,{code:"บริการสุขภาพนักศึกษา",src:"Health paper.png",link:"https://www.sieduit.org/education/health-service-for-student/"}
    ]
    return(
<div className="flex flex-col gap-y-6 ">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-200 to-emerald-200 shadow-md py-7">
        <div className="container max-w-screen-2xl mx-auto font-bold text-3xl text-sky-900 px-10 text-center">
          Useful Information
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
  {courses2.map(({ code, src, link }) => (
    <li key={code} className="group">
      <a
        href={link || "#"}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
      >
        <div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-square md:aspect-[4/3]">
            <img
              src={src}
              alt={code}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
            {code}
          </span>
        </div>
      </a>
    </li>
  ))}
</ul>
<div className="bg-gradient-to-r from-blue-200 to-emerald-200 shadow-md py-7">
        <div className="container max-w-screen-2xl mx-auto font-bold text-3xl text-sky-900 px-10 text-center">
          Transportation
        </div>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto px-4">
  {courses.map(({ code, src, link }) => (
    <li key={code} className="group">
      <a
        href={link || "#"}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
      >
        <div className="relative w-full overflow-hidden rounded-2xl shadow-md group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-square md:aspect-[4/3]">
            <img
              src={src}
              alt={code}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="block text-center font-semibold text-lg md:text-xl bg-gradient-to-r from-sky-100 to-yellow-100 p-3 rounded-b-2xl transition-colors duration-300 group-hover:from-sky-200 group-hover:to-yellow-200">
            {code}
          </span>
        </div>
      </a>
    </li>
  ))}
</ul>
      </div>
      
    );
}
