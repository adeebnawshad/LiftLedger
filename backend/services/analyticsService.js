import { prisma } from "../prisma.js";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Weekly volume = count of non-warmup sets grouped by workout week and muscle group.
 *
 * v1 rules:
 * - Exclude WARMUP sets.
 * - Count NORMAL, FAILURE, DROPSET.
 * - Muscle group comes from Exercise.primaryMuscleGroup.
 *
 * Time window (pick one):
 * - `start` + `end` (YYYY-MM-DD, inclusive) for historical slices
 * - `weeks` rolling lookback from the current week (default 12)
 *
 * @param {{ userId: string, weeks?: number, start?: string, end?: string }} params
 */
export async function getWeeklyVolume({ userId, weeks, start, end }) { 
  const range = resolveRange({ weeks, start, end });
  if (!range.ok) {
    return range;
  }

  const rows =
    range.type === "dates"
      ? await queryWeeklyVolumeByDateRange(userId, range.start, range.endExclusive)
      : await queryWeeklyVolumeByWeeks(userId, range.weeks);

  return {
    ok: true,
    range:
      range.type === "dates"
        ? { type: "dates", start: range.startLabel, end: range.endLabel }
        : { type: "weeks", weeks: range.weeks },
    rows: normalizeWeeklyRows(rows),
  };
}

function resolveRange({ weeks, start, end }) {
  const hasStart = start != null && String(start).trim() !== "";
  const hasEnd = end != null && String(end).trim() !== "";

  if (hasStart || hasEnd) {
    if (!hasStart || !hasEnd) {
      return {
        ok: false,
        status: 400,
        error: "Provide both start and end (YYYY-MM-DD), or omit both to use weeks.",
      };
    }

    const parsed = parseInclusiveDateRange(String(start).trim(), String(end).trim());
    if (!parsed.ok) {
      return { ok: false, status: 400, error: parsed.error };
    }

    return { ok: true, type: "dates", ...parsed };
  }

  const safeWeeks = Number.isFinite(weeks) ? Math.trunc(weeks) : 12;
  const clampedWeeks = Math.min(Math.max(safeWeeks, 1), 104);

  return { ok: true, type: "weeks", weeks: clampedWeeks };
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

async function queryWeeklyVolumeByDateRange(userId, start, endExclusive) {
  return prisma.$queryRaw`
    SELECT
      date_trunc('week', w."startedAt") AS "weekStart",
      e."primaryMuscleGroup" AS "muscleGroup",
      COUNT(*)::int AS "setCount"
    FROM "WorkoutSet" ws
    JOIN "Workout" w
      ON ws."workoutId" = w."id"
    JOIN "Exercise" e
      ON ws."exerciseId" = e."id"
    WHERE w."userId" = ${userId}
      AND ws."setKind" IN ('NORMAL', 'FAILURE', 'DROPSET')
      AND w."startedAt" >= ${start}
      AND w."startedAt" < ${endExclusive}
    GROUP BY 1, 2
    ORDER BY 1, 2;
  `;
}

async function queryWeeklyVolumeByWeeks(userId, weeks) {
  return prisma.$queryRaw`
    SELECT
      date_trunc('week', w."startedAt") AS "weekStart",
      e."primaryMuscleGroup" AS "muscleGroup",
      COUNT(*)::int AS "setCount"
    FROM "WorkoutSet" ws
    JOIN "Workout" w
      ON ws."workoutId" = w."id"
    JOIN "Exercise" e
      ON ws."exerciseId" = e."id"
    WHERE w."userId" = ${userId}
      AND ws."setKind" IN ('NORMAL', 'FAILURE', 'DROPSET')
      AND w."startedAt" >= date_trunc('week', now()) - ${weeks} * INTERVAL '1 week'
    GROUP BY 1, 2
    ORDER BY 1, 2;
  `;
}

function normalizeWeeklyRows(rows) {
  return rows.map((r) => {
    const dt =
      r.weekStart instanceof Date ? r.weekStart : new Date(r.weekStart); // r.weekStart is a string like "2026-05-31". If it's a Date object, use it. If it's a string, convert it to a Date object.
    const weekStart = Number.isNaN(dt.getTime()) // Number.isNaN(dt.getTime()) checks if dt.getTime() is not a number. If it's not a number, convert it to a string.
      ? String(r.weekStart)
      : dt.toISOString().slice(0, 10); // dt.toISOString().slice(0, 10) converts the Date object to a string in ISO format and then slices the first 10 characters to get the date in YYYY-MM-DD format.

    return {
      weekStart,
      muscleGroup: r.muscleGroup,
      setCount: Number(r.setCount) || 0,
    };
  });
}
