import { useState } from "react";

export default function ThemePicker({ theme, onThemeChange }) {
  const [draft, setDraft] = useState(theme);

  function handleSubmit(e) {
    e.preventDefault();
    onThemeChange(draft);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="theme seed"
      />
      <button type="submit">apply theme</button>
    </form>
  );
}