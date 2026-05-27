import { parse } from "csv-parse/sync";
import { mapSetKind } from "./mapSetKind.js";
import { parseHevyDate } from "./parseHevyDate.js";

/** Hevy export column names (must match header row exactly). */
export const HEVY_COLUMNS = {
  title: "title",
  startTime: "start_time",
  endTime: "end_time",
  description: "description",
  exerciseTitle: "exercise_title",
  supersetId: "superset_id",
  exerciseNotes: "exercise_notes",
  setIndex: "set_index",
  setType: "set_type",
  weightLbs: "weight_lbs",
  reps: "reps",
  distanceKm: "distance_km",
  durationS: "duration_s",
  rpe: "rpe",
};

const REQUIRED_HEADERS = [
  HEVY_COLUMNS.startTime,
  HEVY_COLUMNS.exerciseTitle,
  HEVY_COLUMNS.setIndex,
  HEVY_COLUMNS.setType,
];

/**
 * @typedef {Object} ParsedHevySetRow
 * @property {string} workoutKey - Groups sets into one Workout (title + start_time)
 * @property {string} workoutTitle
 * @property {Date} startedAt
 * @property {string} exerciseTitle - Raw Hevy name (for ExerciseAlias lookup)
 * @property {number} setIndexInExercise - Hevy set_index within the exercise
 * @property {number} orderIndex - 0..n-1 across the whole workout (assigned after parse)
 * @property {'WARMUP'|'NORMAL'|'FAILURE'|'DROPSET'} setKind
 * @property {number|null} reps - null for duration-only sets (e.g. dead hang)
 * @property {number|null} durationSeconds - Hevy duration_s
 * @property {number|null} weightLbs
 * @property {number|null} rpe
 * @property {string|null} exerciseNotes
 * @property {number} sourceRow - 1-based CSV row number (header = row 1)
 */

/**
 * @typedef {Object} ParseHevyCsvResult
 * @property {ParsedHevySetRow[]} rows
 * @property {{ row: number, message: string }[]} errors
 * @property {{ totalRecords: number, parsedSets: number, skippedRecords: number }} stats
 */

/**
 * Pure parser: Hevy CSV text → normalized set rows.
 * Does not touch the database. Warmup rows are included; exclude them when counting volume.
 *
 * @param {string} csvText
 * @returns {ParseHevyCsvResult}
 */
export function parseHevyCsv(csvText) {
  const errors = [];

  if (typeof csvText !== "string" || csvText.trim() === "") {
    return {
      rows: [],
      errors: [{ row: 0, message: "CSV input is empty" }], // creating new array, not mutating the existing one
      stats: { totalRecords: 0, parsedSets: 0, skippedRecords: 0 }, // creating new object, not mutating the existing one
    };
  }

  let records;
  try {
    // parse the CSV text into an array of objects, each object representing a row in the CSV whose keys are the headers (see comment beside columns: true)
    // the columns option is true, so the first row is used as the headers
    // the skip_empty_lines option is true, so empty lines are skipped
    // the trim option is true, so whitespace is trimmed
    // the relax_column_count option is true, so the number of columns in each row can vary
    records = parse(csvText, {
      columns: true, // first row = headers, each row becomes an object with the header as the key e.g. { title: "Pull 1", start_time: "Mar 29...", reps: "8" } instead of ["Pull 1", "Mar 29...", "8"]
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    });
  } catch (err) {
    return {
      rows: [], // No sets parsed
      errors: [
        {
          row: 0, // whole file error (not a specific row)
          message: `CSV parse failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
      stats: { totalRecords: 0, parsedSets: 0, skippedRecords: 0 },
    };
  }

  if (records.length === 0) { // headers only, no data rows
    return {
      rows: [],
      errors: [{ row: 0, message: "No data rows in CSV" }],
      stats: { totalRecords: 0, parsedSets: 0, skippedRecords: 0 },
    };
  }

  // check if all required headers are present
  const headerKeys = Object.keys(records[0]);
  for (const col of REQUIRED_HEADERS) {
    if (!headerKeys.includes(col)) {
      errors.push({
        row: 1,
        message: `Missing required column "${col}". Found: ${headerKeys.join(", ")}`, // converting array to a single string with commas
      });
    }
  }
  if (errors.some((e) => e.row === 1 && e.message.includes("Missing required"))) {
    return {
      rows: [],
      errors,
      stats: { totalRecords: records.length, parsedSets: 0, skippedRecords: 0 },
    };
  }

  /** @type {Omit<ParsedHevySetRow, 'orderIndex'>[]} */
  const draftRows = [];
  let skippedRecords = 0;

  records.forEach((record, index) => { // index is the index of the row in the array
    const sourceRow = index + 2; // row 1 = header

    const exerciseTitle = getCell(record, HEVY_COLUMNS.exerciseTitle);
    const repsRaw = getCell(record, HEVY_COLUMNS.reps);
    const durationRaw = getCell(record, HEVY_COLUMNS.durationS);

    // Skip blank lines
    if (!exerciseTitle && !repsRaw && !durationRaw) {
      skippedRecords += 1;
      return;
    }

    const startTimeRaw = getCell(record, HEVY_COLUMNS.startTime);
    const startedAt = parseHevyDate(startTimeRaw);
    if (!startedAt) {
      errors.push({
        row: sourceRow,
        message: `Invalid start_time: "${startTimeRaw ?? ""}"`,
      });
      return;
    }

    const workoutTitle = getCell(record, HEVY_COLUMNS.title) ?? "";
    const workoutKey = buildWorkoutKey(workoutTitle, startTimeRaw);

    if (!exerciseTitle) {;
      errors.push({ row: sourceRow, message: "Missing exercise_title" });
      return;
    }

    const setIndexInExercise = parseInt(getCell(record, HEVY_COLUMNS.setIndex) ?? "", 10);
    if (!Number.isFinite(setIndexInExercise) || setIndexInExercise < 0) {
      errors.push({
        row: sourceRow,
        message: `Invalid set_index: "${getCell(record, HEVY_COLUMNS.setIndex) ?? ""}"`,
      });
      return;
    }

    const setKind = mapSetKind(getCell(record, HEVY_COLUMNS.setType));
    if (!setKind) {
      errors.push({
        row: sourceRow,
        message: `Unknown set_type: "${getCell(record, HEVY_COLUMNS.setType) ?? ""}"`,
      });
      return;
    }

    const reps = parseOptionalInt(repsRaw);
    if (repsRaw != null && reps === null) {
      errors.push({
        row: sourceRow,
        message: `Invalid reps: "${repsRaw}"`,
      });
      return;
    }

    const durationSeconds = parseOptionalInt(durationRaw);
    if (durationRaw != null && durationSeconds === null) {
      errors.push({
        row: sourceRow,
        message: `Invalid duration_s: "${durationRaw}"`,
      });
      return;
    }

    if (reps === null && durationSeconds === null) {
      errors.push({
        row: sourceRow,
        message: "Set must have reps or duration_s (e.g. dead hang)",
      });
      return;
    }

    const weightLbs = parseOptionalFloat(getCell(record, HEVY_COLUMNS.weightLbs));
    if (weightLbs !== null && weightLbs < 0) {
      errors.push({ row: sourceRow, message: `Invalid weight_lbs: "${getCell(record, HEVY_COLUMNS.weightLbs)}"` });
      return;
    }

    const rpe = parseOptionalFloat(getCell(record, HEVY_COLUMNS.rpe));
    if (rpe !== null && (rpe < 0 || rpe > 10)) {
      errors.push({ row: sourceRow, message: `Invalid rpe (expected 0–10): "${getCell(record, HEVY_COLUMNS.rpe)}"` });
      return;
    }

    const exerciseNotes = getCell(record, HEVY_COLUMNS.exerciseNotes) || null;

    draftRows.push({
      workoutKey,
      workoutTitle,
      startedAt,
      exerciseTitle,
      setIndexInExercise,
      setKind,
      reps,
      durationSeconds,
      weightLbs,
      rpe,
      exerciseNotes,
      sourceRow,
    });
  });

  const rows = assignWorkoutOrderIndexes(draftRows);

  return {
    rows,
    errors,
    stats: {
      totalRecords: records.length,
      parsedSets: rows.length,
      skippedRecords,
    },
  };
}

/** Stable key so all sets in one session group together. */
export function buildWorkoutKey(title, startTimeRaw) {
  const t = (title ?? "").trim();
  const s = (startTimeRaw ?? "").trim();
  return `${s}|${t}`;
}

/**
 * Hevy set_index resets per exercise; DB needs one orderIndex per workout.
 * Preserves CSV row order within each workoutKey.
 */
function assignWorkoutOrderIndexes(draftRows) {
  const counters = new Map();

  return draftRows.map((row) => {
    const next = counters.get(row.workoutKey) ?? 0; // get the current count for the workoutKey, or 0 if it doesn't exist
    counters.set(row.workoutKey, next + 1); // store the new count for the workoutKey in the Map (Map is memory between rows, without it every row would have to start at 0)
    return { ...row, orderIndex: next };
  });
}

// return the value of the cell in the record for the given column
function getCell(record, column) {
  const value = record[column]; // record is an object with the headers as keys
  if (value == null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function parseOptionalFloat(raw) {
  if (raw == null || raw === "") return null;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

function parseOptionalInt(raw) {
  if (raw == null || raw === "") return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
