import { useState } from "react";
import { postEvent } from "../api";
import { ACTIVITIES } from "../activities";

export default function ActivityPicker({ onLogged }) {
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
        await postEvent({ activity: "unkniwn", label: customLabel.trim() });
        setCustomLabel("");
        setShowLabelInput(false);
        onLogged?.();
    }

    return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ACTIVITIES.map((activity) => (
          <button key={activity} onClick={() => handleClick(activity)}>
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