/**
 * Parse Hevy `start_time` / `end_time` strings into a Date.
 * Hevy format is usually like: "Mar 29, 2026, 10:04 AM"
 * Some exports truncate to "10:04 A" — we try a small fix for that.
 */
export function parseHevyDate(raw) {
  if (raw == null || String(raw).trim() === "") return null;

  let s = String(raw).trim();

  const tryParse = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  let d = tryParse(s);
  if (d) return d;

  // Spreadsheet/display truncation: "... 10:04 A" → "... 10:04 AM"
  if (/\sA$/i.test(s)) {
    d = tryParse(s.replace(/\sA$/i, " AM"));
    if (d) return d;
  }
  if (/\sP$/i.test(s)) {
    d = tryParse(s.replace(/\sP$/i, " PM"));
    if (d) return d;
  }

  return null;
}
