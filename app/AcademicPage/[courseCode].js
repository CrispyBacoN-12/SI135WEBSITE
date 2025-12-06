// pages/AcademicPage/[courseCode].js (หรือ App Router equivalent)
"use client";

import { useRouter } from 'next/router'; // ใช้สำหรับ Pages Router
import CourseTemplate from '../components/CourseTemplate'; // ปรับ Path ให้ถูกต้อง
import { getCourseDetails } from '../components/courseDetail'; // ดึง Data Store มาใช้

const DynamicCoursePage = () => {
  const router = useRouter();
  const { courseCode } = router.query; 

  const courseData = getCourseDetails(courseCode);

  if (!courseCode) {
    return <div className="p-8 text-xl">กำลังโหลด...</div>;
  }

  if (!courseData) {
    return <div className="p-8 text-xl text-red-600">⚠️ ไม่พบข้อมูลคอร์ส: {courseCode}</div>;
  }
  
  // ส่งตัวแปรที่ดึงมาจาก Data Store ไปให้ CourseTemplate
  return (
    <CourseTemplate
      courseCode={courseCode}
      sheetName={courseData.sheetName}
      courseTitle={courseData.title}
      yearSem={courseData.yearSem}
      canvasLink={courseData.canvasLink}
      youtubeLink={courseData.youtubeLink}
    />
  );
};

export default DynamicCoursePage;
