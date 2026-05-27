/**
 * Normalize Hevy exercise_title for ExerciseAlias lookup.
 * Import pipeline must use the same function when resolving exercises.
 */
export function normalizeAlias(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}
