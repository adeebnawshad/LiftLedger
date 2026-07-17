import {
  getLoggedExercises,
  getStrengthTrends,
  getWeeklyVolume,
} from "./analyticsService.js";

const VOLUME_CHANGE_THRESHOLD = 0.1;
const STRENGTH_FLAT_THRESHOLD = 0.02;

/**
 * Compare two date ranges: volume by muscle, strength by exercise, rule-based insights.
 *
 * @param {{
 *   userId: string,
 *   startA: string, endA: string,
 *   startB: string, endB: string,
 *   exerciseId?: string,
 * }} params
 */
export async function getPeriodInsights({
  userId,
  startA,
  endA,
  startB,
  endB,
  exerciseId,
}) {
  const [volA, volB, loggedA, loggedB] = await Promise.all([
    getWeeklyVolume({ userId, start: startA, end: endA }),
    getWeeklyVolume({ userId, start: startB, end: endB }),
    getLoggedExercises({ userId, start: startA, end: endA }),
    getLoggedExercises({ userId, start: startB, end: endB }),
  ]);

  if (!volA.ok) return volA;
  if (!volB.ok) return volB;
  if (!loggedA.ok) return loggedA;
  if (!loggedB.ok) return loggedB;

  const volumeComparison = compareVolume(volA.rows, volB.rows);

  const exerciseIds = pickExercisesForStrength( // picks the exercise(s) to compare strength for between Period A and Period B.
    loggedA.exercises,
    loggedB.exercises,
    exerciseId,
  );

  const strengthComparison = [];
  for (const ex of exerciseIds) {
    const [trendA, trendB] = await Promise.all([
      getStrengthTrends({
        userId,
        exerciseId: ex.exerciseId,
        start: startA,
        end: endA,
      }),
      getStrengthTrends({
        userId,
        exerciseId: ex.exerciseId,
        start: startB,
        end: endB,
      }),
    ]);
    if (!trendA.ok || !trendB.ok) continue;

    const peakA = peakValue(trendA.rows);
    const peakB = peakValue(trendB.rows);
    const pctChange = percentChange(peakA, peakB);

    // pushes the exercise(s) and their strength data for the 2 periods into the strengthComparison array.
    strengthComparison.push({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      primaryMuscleGroup: ex.primaryMuscleGroup,
      metric: trendA.metric,
      peakA,
      peakB,
      pctChange,
      weeksA: trendA.rows.length,
      weeksB: trendB.rows.length,
    });
  }

  const insights = buildInsights(volumeComparison, strengthComparison);

  return {
    ok: true,
    periodA: { start: startA, end: endA },
    periodB: { start: startB, end: endB },
    volumeComparison, // array of objects, each containing the muscle group, the number of sets in Period A, the number of sets in Period B, and the percentage change in sets.
    strengthComparison, // array of objects, each containing the exercise(s) and their strength data and percentage change for the 2 periods.
    insights, 
  };
}

function sumSetsByMuscle(rows) {
  const totals = new Map();
  for (const row of rows) {
    totals.set(
      row.muscleGroup,
      (totals.get(row.muscleGroup) ?? 0) + row.setCount,
    );
  }
  return totals;
}

// compares the volume of each muscle group between Period A and Period B. returns an array of objects, each containing the muscle group, the number of sets in Period A, the number of sets in Period B, and the percentage change in sets.
function compareVolume(rowsA, rowsB) {
  const totalsA = sumSetsByMuscle(rowsA);
  const totalsB = sumSetsByMuscle(rowsB);
  const muscles = new Set([...totalsA.keys(), ...totalsB.keys()]);

  return [...muscles]
    .sort()
    .map((muscleGroup) => {
      const setsA = totalsA.get(muscleGroup) ?? 0;
      const setsB = totalsB.get(muscleGroup) ?? 0;
      return {
        muscleGroup,
        setsA,
        setsB,
        pctChange: percentChange(setsA, setsB),
      };
    })
    .filter((r) => r.setsA > 0 || r.setsB > 0);
}

// decides which exercises to compare strength for between Period A and Period B.
// either compare one explicitly selected exercise, or compare up to 8 exercises common to both periods.
function pickExercisesForStrength(loggedA, loggedB, exerciseId) {
  if (exerciseId) {
    const found =
      loggedB.find((e) => e.exerciseId === exerciseId) ??
      loggedA.find((e) => e.exerciseId === exerciseId);
    return found ? [found] : [];
  }

  const idsB = new Set(loggedB.map((e) => e.exerciseId));
  return loggedA.filter((e) => idsB.has(e.exerciseId)).slice(0, 8);
}

function peakValue(rows) {
  if (!rows.length) return 0;
  return Math.max(...rows.map((r) => r.value));
}

function percentChange(from, to) {
  if (from === 0) return to === 0 ? 0 : 100;
  return Math.round(((to - from) / from) * 1000) / 10;
}

function buildInsights(volumeComparison, strengthComparison) {
  /** @type {{ type: string, severity: string, title: string, message: string }[]} */
  const insights = [];

  for (const v of volumeComparison) {
    if (v.setsA === 0 || v.setsB === 0) continue;

    if (v.pctChange >= VOLUME_CHANGE_THRESHOLD * 100) {
      insights.push({
        type: "volume_progression",
        severity: "positive",
        title: `${formatMuscle(v.muscleGroup)} volume up`,
        message: `Hard sets rose ${v.pctChange}% (${v.setsA} → ${v.setsB} sets).`,
      });
    } else if (v.pctChange <= -VOLUME_CHANGE_THRESHOLD * 100) {
      insights.push({
        type: "volume_regression",
        severity: "neutral",
        title: `${formatMuscle(v.muscleGroup)} volume down`,
        message: `Hard sets fell ${Math.abs(v.pctChange)}% (${v.setsA} → ${v.setsB} sets).`,
      });
    }
  }

  for (const s of strengthComparison) {
    if (s.peakA === 0 && s.peakB === 0) continue;

    const unit = s.metric === "E1RM" ? "kg" : "reps";
    const flat =
      Math.abs(s.pctChange) <= STRENGTH_FLAT_THRESHOLD * 100;

    if (s.pctChange >= STRENGTH_FLAT_THRESHOLD * 100) {
      insights.push({
        type: "strength_progression",
        severity: "positive",
        title: `${s.exerciseName} stronger`,
        message: `Peak ${s.metric === "E1RM" ? "e1RM" : "reps"} up ${s.pctChange}% (${s.peakA} → ${s.peakB} ${unit}).`,
      });
    } else if (s.pctChange <= -STRENGTH_FLAT_THRESHOLD * 100) {
      insights.push({
        type: "strength_regression",
        severity: "warning",
        title: `${s.exerciseName} weaker`,
        message: `Peak ${s.metric === "E1RM" ? "e1RM" : "reps"} down ${Math.abs(s.pctChange)}% (${s.peakA} → ${s.peakB} ${unit}).`,
      });
    } else if (flat && s.weeksB >= 3) {
      insights.push({
        type: "plateau",
        severity: "neutral",
        title: `${s.exerciseName} plateau`,
        message: `Peak ${s.metric === "E1RM" ? "e1RM" : "reps"} held near ${s.peakB} ${unit} across ${s.weeksB} logged weeks in Period B.`,
      });
    }
  }

  for (const v of volumeComparison) {
    if (v.pctChange < VOLUME_CHANGE_THRESHOLD * 100) continue;

    const related = strengthComparison.find(
      (s) => s.primaryMuscleGroup === v.muscleGroup,
    );
    if (!related) continue;

    const strengthFlat =
      related.pctChange <= STRENGTH_FLAT_THRESHOLD * 100 &&
      related.pctChange >= -STRENGTH_FLAT_THRESHOLD * 100;

    if (strengthFlat) {
      insights.push({
        type: "volume_strength_mismatch",
        severity: "warning",
        title: `Volume–strength mismatch (${formatMuscle(v.muscleGroup)})`,
        message: `${formatMuscle(v.muscleGroup)} volume rose ${v.pctChange}% but ${related.exerciseName} strength barely moved (${related.pctChange}%).`,
      });
    }
  }

  return insights;
}

function formatMuscle(muscleGroup) {
  return muscleGroup
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}