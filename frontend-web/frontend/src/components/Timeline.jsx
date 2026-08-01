import { useEffect, useState } from "react";
import { getTimeline } from "../api";
import { ACTIVITIES, colorForActivity } from "../activities";

const COLORS = {
  work: "#4a7c59",
  programming: "#2c6e91",
  internet: "#8a6fbf",
  sleeping: "#3b3f5c",
  chores: "#c98a4b",
  chilling: "#e0b13c",
  unknown: "#999999",
};

export default function Timeline({ date }) {
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    getTimeline(date).then((data) => setSegments(data.segments));
  }, [date]);

  const dayStartMs = new Date(`${date}T00:00:00`).getTime();
  const dayLengthMs = 24 * 60 * 60 * 1000;

  return (
    <div style={{ display: "flex", height: "40px", width: "100%", border: "1px solid #333" }}>
      {segments.map((seg, i) => {
        const startMs = new Date(seg.start).getTime();
        const endMs = new Date(seg.end).getTime();
        const widthPct = ((endMs - startMs) / dayLengthMs) * 100;

        return (
          <div
            key={i}
            title={`${seg.activity}${seg.label ? `: ${seg.label}` : ""}`}
            style={{
              width: `${widthPct}%`,
              backgroundColor: colorForActivity(seg.activity),
            }}
          />
        );
      })}
    </div>
  );
}