// data/courseDetails.js

export const COURSE_MAPPING = {
    // ----------------------------------------------------
    // SIID245 (ใช้ข้อมูลจากโค้ดเดิมของคุณ)
    // ----------------------------------------------------
    'SIID245': { 
        sheetName: '245%20(MSK)', 
        title: 'Integumentary System, Skeleton and Movement', 
        yearSem: 'Year 2 Semester 1',
        canvasLink: 'https://sirirajcanvas.instructure.com/courses/1065',
        youtubeLink: 'https://www.youtube.com/playlist?list=PLnWAv0tkYmKHzjMLs3ukwFxm0ga0geL7R',
    },
    // ----------------------------------------------------
    // SIID243 (ตัวอย่างการเพิ่มคอร์สอื่น)
    // ----------------------------------------------------
    'SIID243': { 
        sheetName: '243%20(GI)', // สมมติว่านี่คือชื่อ Sheet ที่ใช้สำหรับ SIID243
        title: 'Gastrointestinal System', 
        yearSem: 'Year 2 Semester 1',
        canvasLink: '#', // ใส่ลิงก์จริง
        youtubeLink: '#', // ใส่ลิงก์จริง
    },
    // ... เพิ่มคอร์สอื่นๆ ทั้งหมดที่นี่
};

// ข้อมูลลิงก์รุ่นพี่ (ยังคงต้องใช้ใน Template)
export const coursesSeniorLinks = [ 
 { code: 'SI134', link: 'https://siriraj134.com/acad/siid245', linkname: 'SI134(245)' }, 
 { code: 'SI133', link: 'https://sites.google.com/view/siriraj133official/archives/year-2/siid-245', linkname: 'SI133(245)' }, 
 // ... เพิ่มลิงก์รุ่นพี่ที่เหลือ
];

export function getCourseDetails(code) {
    return COURSE_MAPPING[code];
}
