import { useState } from "react";
import ActivityPicker from "./components/ActivityPicker";
import Timeline from "./components/Timeline";
import ThemePicker from "./components/ThemePicker";
import tick from "./assets/time-ticks.png";

function todayLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export default function App() {
  const [date, setDate] = useState(todayLocalISODate());
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState("");

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Time Tracker</h1>

      <h2>What are you doing?</h2>
      <ActivityPicker onLogged={() => setRefreshKey((k) => k + 1)} theme={theme} />

      <h2 style={{ marginTop: "32px" }}>Today</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <div style={{ marginTop: "12px" }} key={refreshKey}>
        <Timeline date={date} theme={theme} />
        <img src={ tick } style={{ width: "100.2%" }}></img>
      </div>

      <h2 style={{ marginTop: "32px" }}>Theme</h2>
      <ThemePicker theme={theme} onThemeChange={setTheme} />
      
    </div>
  );
}