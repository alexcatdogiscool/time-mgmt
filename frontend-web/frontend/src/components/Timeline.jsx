import { useEffect, useState } from "react";
import { getTimeline } from "../api";
import { colorForActivity } from "../activities";

function formatDuration(startMs, endMs) {
  const totalMinutes = Math.round((endMs - startMs) / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export default function Timeline({ date, theme }) {
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    getTimeline(date).then((data) => setSegments(data.segments));
  }, [date]);

  // Anchor is midnight LOCAL time for this date. Must match how the date
  // string is interpreted -- "YYYY-MM-DDT00:00:00" with no offset is parsed
  // by the browser as local time, which is what we want here.
  const dayStartMs = new Date(`${date}T00:00:00`).getTime();
  const dayEndMs = dayStartMs + 24 * 60 * 60 * 1000;
  const dayLengthMs = dayEndMs - dayStartMs;

  return (
    <div style={{ position: "relative", height: "40px", width: "100%", border: "1px solid #333" }}>
      {segments.map((seg, i) => {
        const startMs = new Date(seg.start).getTime();
        const endMs = new Date(seg.end).getTime();

        const clampedStart = Math.max(startMs, dayStartMs);
        const clampedEnd = Math.min(endMs, dayEndMs);

        const leftPct = ((clampedStart - dayStartMs) / dayLengthMs) * 100;
        const widthPct = ((clampedEnd - clampedStart) / dayLengthMs) * 100;

        return (
          <div
            key={i}
            title={`${seg.activity}${'\n'}${formatDuration(startMs, endMs)}${seg.label ? `: ${seg.label}` : ""}`}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              top: 0,
              bottom: 0,
              backgroundColor: colorForActivity(seg.activity, theme),
            }}
          />
        );
      })}
    </div>
  );
}