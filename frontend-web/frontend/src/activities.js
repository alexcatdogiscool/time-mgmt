export const ACTIVITIES = [
  "work",
  "Uni work",
  "programming",
  "internet",
  "sleeping",
  "chores",
  "chilling",
  "Productive ",
  "unknown",
];

function hashString(str, theme = "") {
  const combined = str + theme;
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 33) ^ combined.charCodeAt(i);
  }
  return hash >>> 0;
}

export function colorForActivity(activity, theme = "") {
  const hash = hashString(activity, theme);
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
}