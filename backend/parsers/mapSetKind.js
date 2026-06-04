/** Maps Hevy `set_type` string to Prisma SetKind enum values. */
export function mapSetKind(raw) {
  if (raw == null || String(raw).trim() === "") return null;

  const s = String(raw).trim().toLowerCase();

  switch (s) {
    case "warmup":
      return "WARMUP";
    case "normal":
      return "NORMAL";
    case "failure":
      return "FAILURE";
    case "dropset":
      return "DROPSET";
    default:
      return null;
  }
}
