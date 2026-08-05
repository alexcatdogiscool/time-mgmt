import { useState } from "react";
import { postEvent } from "../api";
import { ACTIVITIES, colorForActivity } from "../activities";

export default function ActivityPicker({ onLogged, theme }) {
    const [customLabel, setCustomLabel] = useState("");
    const [showLabelInput, setShowLabelInput] = useState(false);

    async function handleClick(activity) {
        if (activity === "unknown") {
            setShowLabelInput(true);
            return;
        }
        await postEvent({ activity });
        onLogged?.();
    }

    async function handleUnknownSubmit() {
        if (!customLabel.trim()) return;
        await postEvent({ activity: "unknown", label: customLabel.trim() });
        setCustomLabel("");
        setShowLabelInput(false);
        onLogged?.();
    }

    return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", width: "100%" }}>
        {ACTIVITIES.map((activity) => (
          <button style={{
            backgroundColor: colorForActivity(activity, theme),
            flex: "1 1 100px",
            padding: "20px 10px"
            }} 
            key={activity} onClick={() => handleClick(activity)}>
            {activity}
          </button>
        ))}
      </div>

      {showLabelInput && (
        <div style={{ marginTop: "12px" }}>
          <input
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="what are you doing?"
          />
          <button onClick={handleUnknownSubmit}>log it</button>
        </div>
      )}
    </div>
  );
}