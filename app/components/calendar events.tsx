import { useEffect, useState, useMemo } from "react";

type EventItem = {
  summary: string;
  start: {
    date?: string;     // all-day
    dateTime?: string; // timed
  };
  end: {
    dateTime?: string;
  };
  location?: string;
  description?: string;
};

function getNextNDates(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }
  return dates;
}

// ---- Flexible parser for summary ------------------------------------------------
type Parsed = { code: string; type: string; title: string };

function parseSummary(summaryRaw: string): Parsed {
  const summary = (summaryRaw ?? "").trim();

  let code = "ไม่ระบุรหัส";
  let type = "LAB";
  let working = summary;

  // 1) try to extract (TYPE) anywhere and remove it from working
  const typeMatch = working.match(/\(([^)]+)\)/);
  if (typeMatch) {
    type = (typeMatch[1] || "").trim() || "ไม่ระบุประเภท";
    working = working.replace(typeMatch[0], "").trim();
  }

  // 2) extract leading code like "SIID 246", "BIO-101", "ABC123"
  const codeMatch = working.match(/^([A-Za-z]{2,}\s*\d+[A-Za-z0-9-]*)\b/);
  if (codeMatch) {
    code = codeMatch[1].trim();
    working = working.slice(codeMatch[0].length).trim();
  } else {
    // fallback: if it starts with something like "SIID 246 Wall..." (no clear code delimiter)
    const loose = working.match(/^([A-Za-z]{2,}\s*\d+)\b/);
    if (loose) {
      code = loose[1].trim();
      working = working.slice(loose[0].length).trim();
    }
  }

  // 3) title handling: keep colon content together if present
  let title = working || summary;
  const colonIdx = working.indexOf(":");
  if (colonIdx !== -1) {
    const left = working.slice(0, colonIdx).trim();
    const right = working.slice(colonIdx + 1).trim();
    title = left ? `${left}: ${right}` : right;
  }

  // cleanup double spaces
  title = title.replace(/\s{2,}/g, " ").trim();

  if (/^asynchronous$/i.test(type)) {
  type = "Async";
}

  return { code, type, title };
}

// format time (handles all-day)
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

export default function GoogleCalendarEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const upcomingDates = useMemo(() => getNextNDates(3), []);

  useEffect(() => {
    async function fetchEvents() {
      const apiKey = "AIzaSyCrx-xVU474LSrdeJ57iT5RnXiubzDA93Q";
      const calendarId =
        "0edf3de872c14ef7b341692d8df9ca88bc84774cd4ca32efe312a1535d6c3443@group.calendar.google.com";
      const timeMin = new Date().toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&maxResults=20&orderBy=startTime&singleEvents=true`;
      const res = await fetch(url);
      const data = await res.json();

      // กรอง: ไม่แสดงคำที่ไม่ต้องการ
      const excludedPatterns = [/Block\s?\d+/i, /Week\s?\d+/i];
      const excludedKeywords = [
        "พักกลางวัน",
        "Reading/Revision/Reflection",
        "Block",
        "กิจกรรมบ่ายวันพุธ",
        "CLO ASSESSMENT",
        "วิชาเลือกเสรี",
        "ออกรับบริจาคธงวันมหิดล",
        "ปาฐกถาวันมหิดล"
      ];

      const filtered = (data.items || []).filter((e: EventItem) => {
        const summary = e.summary?.toLowerCase() || "";
        const matchPattern = excludedPatterns.some((regex) => regex.test(summary));
        const matchKeyword = excludedKeywords.some((word) =>
          summary.includes(word.toLowerCase())
        );
        return !matchPattern && !matchKeyword;
      });

      setEvents(filtered || []);
    }

    fetchEvents();
  }, []);
  // --- จัดกลุ่ม events ตามวันที่ ---
  const groupedEventsAllDates: Record<string, EventItem[]> = {};
  events.forEach((e) => {
    const eventDate = e.start.date || e.start.dateTime?.split("T")[0];
    if (!eventDate) return;
    if (!groupedEventsAllDates[eventDate]) groupedEventsAllDates[eventDate] = [];
    groupedEventsAllDates[eventDate].push(e);
  });

  // --- เลือก 3 วันถัดไปที่มีงาน ---
  const next3DatesWithEvents = Object.keys(groupedEventsAllDates)
    .sort() // เรียงจากวันถัดไป
    .slice(0, 3); // เอา 3 วันแรก

  // จัดกลุ่มตามวันที่
  const groupedEvents = useMemo(() => {
    const result: Record<string, EventItem[]> = {};
    upcomingDates.forEach((date) => {
      result[date] = events.filter((e) => {
        const eventDate = e.start.date || e.start.dateTime?.split("T")[0];
        return eventDate === date;
      });
    });
    return result;
  }, [events, upcomingDates]);
  // --- สร้าง palette สีให้เลือก
  const colorPalette = [
    "from-green-400 to-yellow-600",
    "from-blue-600 to-red-500",
    "from-blue-500 to-blue-300",
    "from-indigo-600 to-indigo-200",
    "from-orange-400 to-orange-600",
  ];

  // --- สร้างฟังก์ชัน map รหัสวิชา → สีคงที่
  const getColorForCode = (() => {
    const map: Record<string, string> = {};
    return (code: string) => {
      if (!map[code]) {
        // เลือกสีใหม่แบบสุ่มจาก palette
        const idx = Object.keys(map).length % colorPalette.length; // ทำให้วนซ้ำ palette ได้
        map[code] = colorPalette[idx];
      }
      return map[code];
    };
  })();

  return (
      <div className="p-6 bg-white shadow rounded-lg w-full max-w-screen-lg mx-auto">
        {next3DatesWithEvents.map((date) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-semibold text-sky-900">
              🗓️{" "}
              {new Date(date).toLocaleDateString("th-TH", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>

            <ul className="ml-6 text-sm mt-1 space-y-2 font-semibold flex flex-col gap p-2 leading-tight">
              {groupedEventsAllDates[date].map((e, i) => {
                const { code: eventCode, type: eventType, title: eventTitle } = parseSummary(e.summary);
                const eventTime = formatEventTime(e);

                return (
                  <li
                    key={i}
                    className="w-full text-sm p-4 rounded-lg shadow-md border border-emerald-500 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-bold text-lg bg-gradient-to-br ${getColorForCode(eventCode)} text-transparent bg-clip-text`}
                        >
                          {eventCode}
                        </h4>

                        <span className="text-gray-400">|</span>

                        <span
                          className={`font-semibold italic bg-gradient-to-br ${getColorForCode(
                            eventCode
                          )} text-transparent bg-clip-text`}
                        >
                          {eventType}
                        </span>
                          <span className="text-gray-500">{eventTime}</span>
                      </div>
                    
                    </div>
 {["LAB", "CBL", "GA","Lab"].includes(eventType) && (
                          <span className="text-black-600 font-semibold italic ml-2">
                            *มีเช็คชื่อ*
                          </span>)}
                    <p className="text-black font-bold mt-1">{eventTitle}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
  );
}
