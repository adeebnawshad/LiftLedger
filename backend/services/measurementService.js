import { prisma } from "../prisma.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Weekly average measurement value for a body site in a date range.
 *
 * @param {{ userId: string, site: string, start: string, end: string }} params
 */
export async function getMeasurementTrends({ userId, site, start, end }) {
  const parsed = parseInclusiveDateRange(start, end);
  if (!parsed.ok) {
    return { ok: false, status: 400, error: parsed.error };
  }

  const siteValue = String(site ?? "BODY_WEIGHT").toUpperCase();

  const rows = await prisma.$queryRaw`
    SELECT
      date_trunc('week', m."measuredAt") AS "weekStart",
      AVG(m.value::float) AS "value"
    FROM "BodyMeasurementEntry" m
    WHERE m."userId" = ${userId}
      AND m.site = ${siteValue}::"MeasurementSite"
      AND m."measuredAt" >= ${parsed.start}
      AND m."measuredAt" < ${parsed.endExclusive}
    GROUP BY 1
    ORDER BY 1;
  `;

  return {
    ok: true,
    site: siteValue,
    unit: siteValue === "BODY_WEIGHT" ? "kg" : "cm",
    range: { start: parsed.startLabel, end: parsed.endLabel },
    rows: normalizeMeasurementRows(rows),
  };
}

function parseInclusiveDateRange(startStr, endStr) {
  if (!DATE_RE.test(startStr) || !DATE_RE.test(endStr)) {
    return { ok: false, error: "Dates must be YYYY-MM-DD." };
  }

  const start = new Date(`${startStr}T00:00:00.000Z`);
  const end = new Date(`${endStr}T00:00:00.000Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: "Invalid date." };
  }

  if (start > end) {
    return { ok: false, error: "start must be on or before end." };
  }

  const endExclusive = new Date(end);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

  return {
    ok: true,
    start,
    endExclusive,
    startLabel: startStr,
    endLabel: endStr,
  };
}

function normalizeMeasurementRows(rows) {
  return rows.map((r) => {
    const dt =
      r.weekStart instanceof Date ? r.weekStart : new Date(r.weekStart);
    const weekStart = Number.isNaN(dt.getTime())
      ? String(r.weekStart)
      : dt.toISOString().slice(0, 10);
    const value = Math.round((Number(r.value) || 0) * 10) / 10;
    return { weekStart, value };
  });
}
