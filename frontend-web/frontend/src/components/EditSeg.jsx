// src/components/EditSeg.jsx
import { useState } from "react";
import { ACTIVITIES } from "../activities";
import { updateEvent } from "../api";

// Converts an ISO string (e.g. "2026-08-01T16:57:58+12:00") into the
// "YYYY-MM-DDTHH:mm" format required by <input type="datetime-local">.
function toDatetimeLocalValue(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditSeg({ seg, onClose, onSaved }) {
  const [activity, setActivity] = useState(seg.activity);
  const [label, setLabel] = useState(seg.label ?? "");
  const [startLocal, setStartLocal] = useState(toDatetimeLocalValue(seg.start));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // datetime-local has no timezone info -- `new Date(...)` interprets
      // it as local time automatically, then .toISOString() converts to
      // UTC for the backend, matching how the rest of the app stores time.
      const timestamp = new Date(startLocal).toISOString();

      await updateEvent(seg.id, {
        activity,
        label: activity === "unknown" ? label : null,
        timestamp,
      });
      onSaved();
    } catch (err) {
      setError("Failed to save — try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <form
        style={modalStyle}
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside the form
        onSubmit={handleSubmit}
      >
        <h3>Edit activity</h3>

        <label>
          Activity
          <select value={activity} onChange={(e) => setActivity(e.target.value)}>
            {ACTIVITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        {activity === "unknown" && (
          <label>
            Label
            <input value={label} onChange={(e) => setLabel(e.target.value)} />
          </label>
        )}

        <label>
          Start time
          <input
            type="datetime-local"
            value={startLocal}
            onChange={(e) => setStartLocal(e.target.value)}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle = {
  background: "white",
  color: "black",
  padding: "1.5rem",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  minWidth: "280px",
};