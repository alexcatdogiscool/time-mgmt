export const ACTIVITIES = [
  "work",
  "Uni work",
  "programming",
  "internet",
  "sleeping",
  "chores",
  "chilling",
  "unknown",
];

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // force unsigned 32-bit int
}

export function colorForActivity(activity) {
    const hash = hashString(activity);
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 54%)`;
}