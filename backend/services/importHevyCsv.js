import { prisma } from "../prisma.js";
import { parseHevyCsv } from "../parsers/parseHevyCsv.js";
import { EXCLUDED_CSV_TITLES } from "../../prisma/lib/csvExerciseConfig.js";
import { normalizeAlias } from "../../prisma/lib/normalizeAlias.js";

const MAX_SAMPLE_ROWS = 3;

/** Prisma default interactive transaction timeout is 5s — large Hevy exports need more. */
const IMPORT_TRANSACTION_TIMEOUT_MS = 600_000; // 10 minutes

/**
 * @typedef {Object} ImportHevyCsvResult
 * @property {boolean} ok
 * @property {number} [status] // brackets mean optional
 * @property {string} [error]
 * @property {string} [importId]
 * @property {string} [fileName]
 * @property {object} [stats]
 * @property {{ row: number, message: string }[]} [parseErrors]
 * @property {{ exerciseTitle: string, skippedSets: number, sampleSourceRows: number[] }[]} [unknownExercises]
 */

/**
 * Parse a Hevy CSV and persist workouts/sets. Unknown exercises are skipped, not fatal.
 *
 * @param {{ csvText: string, fileName: string, userId: string }} params
 * @returns {Promise<ImportHevyCsvResult>}
 */
export async function importHevyCsvToDb({ csvText, fileName, userId }) {
  const parsed = parseHevyCsv(csvText);

  if (hasFatalParseErrors(parsed.errors)) { // error on header row or invalid file
    return {
      ok: false,
      status: 422,
      error: "CSV could not be parsed",
      fileName,
      stats: parsed.stats,
      parseErrors: parsed.errors,
    };
  }

  // get all aliases from the database
  const aliasRows = await prisma.exerciseAlias.findMany({ // ExerciseAlias is a table in the database that stores the aliases for the exercises. .findMany() gets all matching rows from the table. (here: every alias in the DB). await - wait until Neon responds; aliasRows becomes a normal array when done.
    select: { alias: true, exerciseId: true }, // // runs a sql query like "SELECT alias, exerciseId FROM exerciseAliases"  
  });
  // aliasToExerciseId is a map of aliases to exercise IDs.
  const aliasToExerciseId = new Map(
    aliasRows.map((row) => [row.alias, row.exerciseId]), // [row.alias, row.exerciseId] - a pair: key first, value second
  );

  /** @type {Map<string, { skippedSets: number, sampleSourceRows: number[] }>} */ // Map is a data structure that stores key-value pairs. here: exerciseTitle -> { skippedSets: number, sampleSourceRows: number[] }
  const unknownByTitle = new Map();
  let skippedSets = 0; // count of sets that were skipped because they were unknown exercises

  const workoutGroups = groupRowsByWorkout(parsed.rows); // group rows by workout - workoutTitle, startedAt, sets[] (each set is a row from the CSV)

  try {
    const summary = await prisma.$transaction(async (tx) => { // $transaction - run many DB operations as one unit. tx is a database transaction object - a prisma client that only works inside this tranascation
      const csvImport = await tx.csvImport.create({  // tx - prisma client for the current transaction. .csvImport - the CsvImport table from our schema / model. .create() creates a new row in the table.
        data: { // INSERT INTO "CsvImport" (userId, fileName, status) VALUES (?, ?, ?)
          userId,
          fileName,
          status: "PROCESSING", // "PROCESSING" - the import is in progress
        },
      });

      let workoutsCreated = 0;
      let setsImported = 0;

      for (const group of workoutGroups) {
        /** @type {{ row: import("../parsers/parseHevyCsv.js").ParsedHevySetRow, exerciseId: string }[]} */
        const mappableSets = []; // array of sets that can be mapped to an exercise ID

        for (const row of group.sets) {
          if (EXCLUDED_CSV_TITLES.has(row.exerciseTitle)) {
            skippedSets += 1;
            continue;
          }
          const exerciseId = resolveExerciseId(row.exerciseTitle, aliasToExerciseId);
          if (!exerciseId) {
            skippedSets += 1;
            recordUnknownExercise(unknownByTitle, row); // unknownByTitle is a Map of exercise titles to information about the unknown exercises. row is the current set row from the CSV.
            continue;
          }
          mappableSets.push({ row, exerciseId }); // add the set to the mappableSets array
        }

        if (mappableSets.length === 0) continue; // if no sets can be mapped to an exercise ID, skip the workout

        await tx.workout.create({ // tx - prisma client for the current transaction. .workout - the Workout table from our schema / model. .create() creates a new row in the table.
          data: { // INSERT INTO "Workout" (userId, startedAt, notes, csvImportId) VALUES (?, ?, ?, ?). (This data object is the values Prisma will use to perform the INSERT into the Workout table (and related inserts for sets).)
            userId,
            startedAt: group.startedAt,
            notes: group.workoutTitle || null,
            csvImportId: csvImport.id,
            sets: {
              create: mappableSets.map(({ row, exerciseId }) => toWorkoutSetCreate(row, exerciseId)), // mappableSets is an array like: [{ row: /* parsed set row */, exerciseId: "abc" }, { row: /* parsed set row */, exerciseId: "def" },] .map() loops through each element of the array and calls toWorkoutSetCreate() for each element. This converts each element into the exact object Prisma needs to create a WorkoutSet.
            },
          },
        });

        workoutsCreated += 1;
        setsImported += mappableSets.length;
      }

      const unknownExercises = toUnknownExerciseList(unknownByTitle); // unknownExercises is an array of objects like: [{ exerciseTitle: "exerciseTitle1", skippedSets: 1, sampleSourceRows: [1] }, { exerciseTitle: "exerciseTitle2", skippedSets: 2, sampleSourceRows: [2] },]
      // Build a summary object with of everything that wasn't perfect about the import
      const errorDetails = {
        parseErrors: parsed.errors,
        unknownExercises,
        skippedSets,
      };

      await tx.csvImport.update({
        where: { id: csvImport.id },
        data: {
          status: "COMPLETED",
          errorDetails,
        },
      });

      // summary on line 55 is set to this return value
      return {
        importId: csvImport.id,
        workoutsCreated,
        setsImported,
        unknownExercises,
      };
    }, {
      maxWait: 30_000,
      timeout: IMPORT_TRANSACTION_TIMEOUT_MS,
    });

    // this is the return value of the importHevyCsvToDb function
    return {
      ok: true,
      importId: summary.importId,
      fileName,
      stats: {
        ...parsed.stats, // parsed.stats is an object like: { totalRows: 100, totalWorkouts: 10, totalSets: 100, totalUnknownExercises: 10, } ...spread operator copies all properties from parsed.stats into the new object.
        workoutsCreated: summary.workoutsCreated,
        setsImported: summary.setsImported,
        setsSkipped: skippedSets,
      },
      parseErrors: parsed.errors,
      unknownExercises: summary.unknownExercises,
    };
  } catch (err) { // If something throws or a rejected Promise isn’t caught inside the try, execution jumps to catch. avaScript passes that thrown value into err (you can name it anything: catch (e), catch (error)).
    const message = err instanceof Error ? err.message : String(err);

    await prisma.csvImport.create({
      data: {
        userId,
        fileName,
        status: "FAILED",
        errorDetails: {
          message,
          parseErrors: parsed.errors,
        },
      },
    });

    // this is the return value of the importHevyCsvToDb function if the import failed while saving to the database
    return {
      ok: false,
      status: 500,
      error: "Import failed while saving to the database",
      fileName,
      parseErrors: parsed.errors,
    };
  }
}

function hasFatalParseErrors(errors) {
  return errors.some((e) => e.row <= 1); // some returns true if any element in the array satisfies the condition. here e.row means the row number of the error.
}

/** Preserve first-seen workout order from the CSV. */
function groupRowsByWorkout(rows) { // rows from the parsed CSV 
  /** @type {Map<string, { workoutTitle: string, startedAt: Date, sets: typeof rows }>} */ // key is workoutKey string
  const groups = new Map(); // temporary bucket while looping through rows

  for (const row of rows) {
    let group = groups.get(row.workoutKey); // Do we already have a bucket for this workout session?
    if (!group) {
      group = {
        workoutTitle: row.workoutTitle,
        startedAt: row.startedAt,
        sets: [],
      };
      groups.set(row.workoutKey, group);
    }
    group.sets.push(row); // Add the current row to the bucket's sets array
  }

  return [...groups.values()]; // copy all group objects (no keys) into a normal array
}

// resolveExerciseId - find the exercise ID for a given exercise title
function resolveExerciseId(exerciseTitle, aliasToExerciseId) { 
  const key = normalizeAlias(exerciseTitle);
  if (!key) return null;
  return aliasToExerciseId.get(key) ?? null;
}

function recordUnknownExercise(unknownByTitle, row) {
  let entry = unknownByTitle.get(row.exerciseTitle);
  if (!entry) {
    entry = { skippedSets: 0, sampleSourceRows: [] };
    unknownByTitle.set(row.exerciseTitle, entry);
  }
  entry.skippedSets += 1;
  if (entry.sampleSourceRows.length < MAX_SAMPLE_ROWS) {
    entry.sampleSourceRows.push(row.sourceRow);
  }
}

function toUnknownExerciseList(unknownByTitle) {
  return [...unknownByTitle.entries()] // [...unknownByTitle.entries()] - convert the Map to a normal array of key-value pairs so you can .map and .sort. ... is the spread operator, which spreads the elements of the Map into a normal array. (here: [['exerciseTitle1', { skippedSets: 1, sampleSourceRows: [1] }], ['exerciseTitle2', { skippedSets: 2, sampleSourceRows: [2] }],] .entries() returns an iterator of [key, value] pairs.
  // for each pair [exerciseTitle, info], create a new object with the exercise title, skipped sets, and sample source rows
  .map(([exerciseTitle, info]) => ({ // .map() loops through each element of the array and calls the function for each element. Here: [exerciseTitle, info] is a pair: key first, value second.
      exerciseTitle, 
      skippedSets: info.skippedSets,
      sampleSourceRows: info.sampleSourceRows,
    }))
    .sort((a, b) => b.skippedSets - a.skippedSets); // sort the array by skipped sets in descending order
    // output: Array like: [{ exerciseTitle: "exerciseTitle1", skippedSets: 1, sampleSourceRows: [1] }, { exerciseTitle: "exerciseTitle2", skippedSets: 2, sampleSourceRows: [2] },]
}

function toWorkoutSetCreate(row, exerciseId) {
  return {
    exerciseId,
    orderIndex: row.orderIndex,
    setKind: row.setKind,
    reps: row.reps,
    durationSeconds: row.durationSeconds,
    distanceKm: row.distanceKm,
    weightAmount: row.weightLbs,
    weightUnit: row.weightLbs != null ? "LB" : null,
    rpe: row.rpe,
  };
}
