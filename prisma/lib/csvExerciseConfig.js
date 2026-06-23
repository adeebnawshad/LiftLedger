/** CSV titles excluded from the exercise library entirely. */
export const EXCLUDED_CSV_TITLES = new Set(["Muscle up transition"]);

/**
 * Merge Hevy spelling variants onto one canonical Exercise name.
 * Aliases point variant titles at the canonical row.
 */
export const MERGE_TO_CANONICAL = {
  "Ring dip": "Ring Dips",
  "RTO Dip": "Ring Dips",
  "ring pushups": "Ring Push Up",
  "Dead hang": "Dead Hang",
};

/** @param {string} csvTitle */
// canonicalExerciseName() is a function that takes a CSV title and returns the canonical exercise name. Exam
export function canonicalExerciseName(csvTitle) {
  return MERGE_TO_CANONICAL[csvTitle] ?? csvTitle; // If the CSV title is in the MERGE_TO_CANONICAL object, return the canonical exercise name, otherwise return the CSV title.
}
