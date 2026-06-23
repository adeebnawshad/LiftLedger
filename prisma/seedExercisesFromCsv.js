import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseHevyCsv } from "../backend/parsers/parseHevyCsv.js";
import { prisma } from "../backend/prisma.js";
import { classifyExercise } from "./lib/classifyExercise.js";
import {
  EXCLUDED_CSV_TITLES,
  canonicalExerciseName,
} from "./lib/csvExerciseConfig.js";
import { normalizeAlias } from "./lib/normalizeAlias.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_CSV = path.join(__dirname, "../backend/fixtures/workouts.csv");

/**
 * Seed Exercise + ExerciseAlias rows from unique Hevy titles in a CSV export.
 *
 * @param {string} [csvPath]
 */
export async function seedExercisesFromCsv(csvPath = DEFAULT_CSV) {
  const csvText = readFileSync(csvPath, "utf8");
  const parsed = parseHevyCsv(csvText);

  /** @type {Map<string, Set<string>>} canonical name → CSV variant titles */
  const groups = new Map();

  for (const row of parsed.rows) {
    const title = row.exerciseTitle?.trim();
    if (!title || EXCLUDED_CSV_TITLES.has(title)) continue;

    const canonical = canonicalExerciseName(title);
    let variants = groups.get(canonical);
    if (!variants) {
      variants = new Set();
      groups.set(canonical, variants);
    }
    variants.add(title);
  }

  let exerciseCount = 0;
  let aliasCount = 0;

  for (const [canonical, variants] of [...groups.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const meta = classifyExercise(canonical);

    const exercise = await prisma.exercise.upsert({
      where: { name: canonical },
      create: {
        name: canonical,
        primaryMuscleGroup: meta.primaryMuscleGroup,
        exerciseType: meta.exerciseType,
        strengthTracking: meta.strengthTracking,
      },
      update: {
        primaryMuscleGroup: meta.primaryMuscleGroup,
        exerciseType: meta.exerciseType,
        strengthTracking: meta.strengthTracking,
      },
    });
    exerciseCount += 1;

    for (const variant of variants) {
      const alias = normalizeAlias(variant);
      if (!alias) continue;

      await prisma.exerciseAlias.upsert({
        where: { alias },
        create: { alias, exerciseId: exercise.id },
        update: { exerciseId: exercise.id },
      });
      aliasCount += 1;
    }
  }

  console.log(
    `Seeded ${exerciseCount} exercises and ${aliasCount} aliases from ${path.basename(csvPath)}.`,
  );
  return { exerciseCount, aliasCount, csvPath };
}

const isMain = process.argv[1]?.endsWith("seedExercisesFromCsv.js");
if (isMain) {
  const csvArg = process.argv[2];
  seedExercisesFromCsv(csvArg)
    .catch((err) => {
      console.error("CSV exercise seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
