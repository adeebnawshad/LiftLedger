import { prisma } from "../prisma.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const MEASUREMENT_SITES = new Set([
  "BODY_WEIGHT",
  "NECK",
  "CHEST",
  "WAIST",
  "HIPS",
  "LEFT_ARM",
  "RIGHT_ARM",
  "LEFT_FOREARM",
  "RIGHT_FOREARM",
  "LEFT_THIGH",
  "RIGHT_THIGH",
  "LEFT_CALF",
  "RIGHT_CALF",
]);

/**
 * Return all measurement entries (date, value) for a user and site.
 *
 * @param {{ userId: string, site?: string }} params
 */
export async function getMeasurementTrends({ userId, site }) {
  const siteValue = String(site ?? "BODY_WEIGHT").toUpperCase();
  if (!MEASUREMENT_SITES.has(siteValue)) {
    return { ok: false, status: 400, error: "Invalid measurement site." };
  }

  const rows = await prisma.$queryRaw`
    SELECT
      m."measuredAt",
      m.value
    FROM "BodyMeasurementEntry" m
    WHERE m."userId" = ${userId}
      AND m.site = ${siteValue}::"MeasurementSite"
    ORDER BY m."measuredAt" ASC;
  `;

  return {
    ok: true,
    site: siteValue,
    unit: siteValue === "BODY_WEIGHT" ? "lbs" : "inches",
    rows: normalizeMeasurementRows(rows),
  };
}


/**
 * Same-day bodyweight vs girth pairs for scatter chart.
 * Date is for tooltip only (axes use bodyweight / measurement).
 *
 * @param {{ userId: string, site: string }} params
 */
export async function getMeasurementScatter({ userId, site }) {
  const siteValue = String(site ?? "").toUpperCase();
  if (!MEASUREMENT_SITES.has(siteValue) || siteValue === "BODY_WEIGHT") {
    return {
      ok: false,
      status: 400,
      error: "Invalid measurement site to compare against body weight.",
    };
  }

  const rows = await prisma.$queryRaw`
    SELECT
      (m."measuredAt" AT TIME ZONE 'UTC')::date AS "measuredAt",
      bw.value AS bodyweight,
      m.value AS measurement
    FROM "BodyMeasurementEntry" m
    INNER JOIN "BodyMeasurementEntry" bw
      ON bw."userId" = m."userId"
      AND bw.site = 'BODY_WEIGHT'::"MeasurementSite"
      AND (bw."measuredAt" AT TIME ZONE 'UTC')::date
        = (m."measuredAt" AT TIME ZONE 'UTC')::date
    WHERE m."userId" = ${userId}
      AND m.site = ${siteValue}::"MeasurementSite"
    ORDER BY bodyweight ASC
  `;

  return {
    ok: true,
    site: siteValue,
    units: { bodyweight: "lbs", measurement: "inches" },
    rows: normalizeScatterRows(rows),
  };
}

/**
 * Same-day waist vs other girth pairs for scatter chart.
 * Date is for tooltip only (axes use waist / measurement inches).
 *
 * @param {{ userId: string, site: string }} params
 */
export async function getWaistMeasurementScatter({ userId, site }) {
  const siteValue = String(site ?? "").toUpperCase();
  if (
    !MEASUREMENT_SITES.has(siteValue) ||
    siteValue === "BODY_WEIGHT" ||
    siteValue === "WAIST"
  ) {
    return {
      ok: false,
      status: 400,
      error:
        "Provide a girth site other than WAIST or BODY_WEIGHT (e.g. CHEST, LEFT_ARM).",
    };
  }

  const rows = await prisma.$queryRaw`
    SELECT
      (m."measuredAt" AT TIME ZONE 'UTC')::date AS "measuredAt",
      w.value AS waist,
      m.value AS measurement
    FROM "BodyMeasurementEntry" m
    INNER JOIN "BodyMeasurementEntry" w
      ON w."userId" = m."userId"
      AND w.site = 'WAIST'::"MeasurementSite"
      AND (w."measuredAt" AT TIME ZONE 'UTC')::date
        = (m."measuredAt" AT TIME ZONE 'UTC')::date
    WHERE m."userId" = ${userId}
      AND m.site = ${siteValue}::"MeasurementSite"
    ORDER BY waist ASC
  `;

  return {
    ok: true,
    site: siteValue,
    units: { waist: "inches", measurement: "inches" },
    rows: normalizeWaistScatterRows(rows),
  };
}

function normalizeMeasurementRows(rows) {
  return rows.map((r) => {
    const dt =
      r.measuredAt instanceof Date ? r.measuredAt : new Date(r.measuredAt);
    const measuredAt = Number.isNaN(dt.getTime())
      ? String(r.measuredAt)
      : dt.toISOString().slice(0, 10);
    const value = Math.round((Number(r.value) || 0) * 10) / 10; // round to 1 decimal place
    return { measuredAt, value };
  });
}

function normalizeScatterRows(rows) {
  const round1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  return rows.map((r) => {
    const dt =
      r.measuredAt instanceof Date ? r.measuredAt : new Date(r.measuredAt);
    const measuredAt = Number.isNaN(dt.getTime())
      ? String(r.measuredAt).slice(0, 10)
      : dt.toISOString().slice(0, 10);
    return {
      measuredAt,
      bodyweight: round1(r.bodyweight),
      measurement: round1(r.measurement),
    };
  });
}

function normalizeWaistScatterRows(rows) {
  const round1 = (n) => Math.round((Number(n) || 0) * 10) / 10;
  return rows.map((r) => {
    const dt =
      r.measuredAt instanceof Date ? r.measuredAt : new Date(r.measuredAt);
    const measuredAt = Number.isNaN(dt.getTime())
      ? String(r.measuredAt).slice(0, 10)
      : dt.toISOString().slice(0, 10);
    return {
      measuredAt,
      waist: round1(r.waist),
      measurement: round1(r.measurement),
    };
  });
}

/**
 * Create a single body measurement entry (lbs for BODY_WEIGHT, inches otherwise).
 *
 * @param {{ userId: string, site: string, value: number|string, measuredAt: string, notes?: string|null }} params
 */
export async function createMeasurementEntry({
  userId,
  site,
  value,
  measuredAt,
  notes,
}) {
  if (!userId) {
    return { ok: false, status: 400, error: "userId is required." };
  }

  const siteValue = String(site ?? "").toUpperCase();
  if (!MEASUREMENT_SITES.has(siteValue)) {
    return { ok: false, status: 400, error: "Invalid measurement site." };
  }

  if (!DATE_RE.test(String(measuredAt ?? ""))) {
    return { ok: false, status: 400, error: "measuredAt must be YYYY-MM-DD." };
  }

  const measuredAtDate = new Date(`${measuredAt}T00:00:00.000Z`);
  if (Number.isNaN(measuredAtDate.getTime())) { // check if the date is valid
    return { ok: false, status: 400, error: "Invalid measuredAt date." };
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return { ok: false, status: 400, error: "value must be a positive number." };
  }

  const notesValue =
    notes == null || String(notes).trim() === ""
      ? null
      : String(notes).trim();

  try {
    const entry = await prisma.bodyMeasurementEntry.create({
      data: {
        userId,
        site: siteValue,
        value: numericValue,
        measuredAt: measuredAtDate,
        notes: notesValue,
      },
    });
    return { ok: true, entry };
  } catch (error) {
    return { ok: false, status: 500, error: error.message };
  }
}