import { useEffect, useState } from "react";

type EventItem = {
  summary: string;
  start: {
    date?: string;     // all-day
    dateTime?: string; // timed
  };
  end?: {
    dateTime?: string;
  };
};

const KEYWORDS = ["CLO ASSESSMENT"];

// ฟังก์ชันตรวจ keyword
function hasKeyword(summary: string) {
  if (!summary) return false;
  const text = summary.toUpperCase();
  return KEYWORDS.some((kw) => text.includes(kw));
}

// ฟอร์แมตเวลา
function formatEventTime(e: EventItem): string {
  if (e.start?.dateTime) {
    const start = new Date(e.start.dateTime);
    const end = e.end?.dateTime ? new Date(e.end.dateTime) : null;
    const startStr = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (end) {
      const endStr = end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `${startStr}–${endStr}`;
    }
    return startStr;
  }
  if (e.start?.date) return "ตลอดวัน";
  return "เวลาไม่ระบุ";
}

// ฟังก์ชันนับถอยหลัง
function getCountdown(targetDateTime?: string) {
  if (!targetDateTime) return "ไม่ระบุเวลา";
  const now = new Date();
  const target = new Date(targetDateTime);
  const diff = target.getTime() - now.getTime(); // ms

  if (diff <= 0) return "เริ่มแล้ว";

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days > 0 ? days + " วัน " : ""}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function Assignments() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [now, setNow] = useState(new Date());

  // อัปเดตเวลาทุกวินาที
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ดึง events จาก Google Calendar
  useEffect(() => {
    async function fetchEvents() {
      const apiKey = "AIzaSyCrx-xVU474LSrdeJ57iT5RnXiubzDA93Q";
      const calendarId =
        "0edf3de872c14ef7b341692d8df9ca88bc84774cd4ca32efe312a1535d6c3443@group.calendar.google.com";
      const timeMin = new Date().toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&maxResults=200&orderBy=startTime&singleEvents=true`;
      const res = await fetch(url);
      const data = await res.json();

      // กรองเฉพาะ keyword
     const filtered = (data.items || [])
  .filter((e: EventItem) => hasKeyword(e.summary))
  .sort((a, b) => {
    const timeA = new Date(a.start.dateTime || a.start.date).getTime();
    const timeB = new Date(b.start.dateTime || b.start.date).getTime();
    return timeA - timeB;
  })
  .slice(0, 3); // เอาแค่ 3 event แรก

      setEvents(filtered || []);
    }

    fetchEvents();
  }, []);

  return (
    <div>
      {events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((e, i) => (
            <li
              key={i}
              className="w-full p-4 rounded-lg shadow-md border border-rose-500 bg-white"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold jsutify-start basis-1/2 break-words whitespace-normal">{e.summary}</h4>
                <div className="flex flex-col items-end justify-end basis-2/5">
                  
                  {e.start.dateTime && (
                    <span className="text-red-500 font-semibold text-sm">
                      เหลือเวลา: {getCountdown(e.start.dateTime)}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">ไม่มีงานที่ตรงกับ keyword</p>
      )}
    </div>
  );
}
function sort(arg0: (a: any, b: any) => number) {
    throw new Error("Function not implemented.");
}

