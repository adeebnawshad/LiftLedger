import { prisma } from "../backend/prisma.js";
import { exerciseSeeds } from "./data/exercises.js";
import { normalizeAlias } from "./lib/normalizeAlias.js";

export async function seedExercises() {
  let exerciseCount = 0;
  let aliasCount = 0;

  for (const seed of exerciseSeeds) {
    const exercise = await prisma.exercise.upsert({
      where: { name: seed.name },
      create: {
        name: seed.name,
        primaryMuscleGroup: seed.primaryMuscleGroup,
        exerciseType: seed.exerciseType,
      },
      update: {
        primaryMuscleGroup: seed.primaryMuscleGroup,
        exerciseType: seed.exerciseType,
      },
    });
    exerciseCount += 1;

    // Canonical name also resolves as an alias (normalized).
    const aliasStrings = new Set([
      seed.name,
      ...seed.aliases,
    ]);

    for (const rawAlias of aliasStrings) {
      const alias = normalizeAlias(rawAlias);
      if (!alias) continue;

      await prisma.exerciseAlias.upsert({
        where: { alias },
        create: { alias, exerciseId: exercise.id },
        update: { exerciseId: exercise.id },
      });
      aliasCount += 1;
    }
  }

  console.log(`Seeded ${exerciseCount} exercises and ${aliasCount} aliases.`);
  return { exerciseCount, aliasCount };
}

// Run directly: node prisma/seedExercises.js
const isMain = process.argv[1]?.endsWith("seedExercises.js");
if (isMain) {
  seedExercises()
    .catch((err) => {
      console.error("Exercise seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
