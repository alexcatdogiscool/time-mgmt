import { useState } from "react";
import ActivityPicker from "./components/ActivityPicker";
import Timeline from "./components/Timeline";

function todayLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function App() {
  const [date, setDate] = useState(todayLocalISODate());
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Time Tracker</h1>

      <h2>What are you doing?</h2>
      <ActivityPicker onLogged={() => setRefreshKey((k) => k + 1)} />

      <h2 style={{ marginTop: "32px" }}>Today</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <div style={{ marginTop: "12px" }} key={refreshKey}>
        <Timeline date={date} />
      </div>
    </div>
  );
}