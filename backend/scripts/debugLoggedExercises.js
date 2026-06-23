import "dotenv/config";
import { prisma } from "../prisma.js";

const userId = process.env.DEFAULT_USER_ID;
const ranges = [
  ["2026-02-01", "2026-03-01", "Period A"],
  ["2026-04-01", "2026-05-01", "Period B"],
];

for (const [start, end, label] of ranges) {
  const rows = await prisma.$queryRaw`
    SELECT e.name, e."strengthTracking", COUNT(*)::int as sets,
      COUNT(ws."weightAmount")::int as with_weight
    FROM "WorkoutSet" ws
    JOIN "Workout" w ON ws."workoutId" = w."id"
    JOIN "Exercise" e ON ws."exerciseId" = e."id"
    WHERE w."userId" = ${userId}
      AND ws."setKind" IN ('NORMAL','FAILURE','DROPSET')
      AND ws.reps IS NOT NULL AND ws.reps > 0
      AND w."startedAt" >= ${new Date(start)}
      AND w."startedAt" < ${new Date(end)}
    GROUP BY e.name, e."strengthTracking"
    ORDER BY sets DESC
    LIMIT 25
  `;
  console.log(`\n=== ${label} (all logged sets) ===`);
  for (const r of rows) {
    console.log(
      `${r.name} | ${r.strengthTracking} | sets: ${r.sets} | with weight: ${r.with_weight}`,
    );
  }
}

// Bench exercises in library vs linked to sets
const bench = await prisma.exercise.findMany({
  where: { name: { contains: "Bench" } },
  select: { name: true, strengthTracking: true, _count: { select: { workoutSets: true } } },
  orderBy: { name: "asc" },
});
console.log("\n=== Bench exercises in library ===");
for (const e of bench) {
  console.log(`${e.name} | ${e.strengthTracking} | sets linked: ${e._count.workoutSets}`);
}

await prisma.$disconnect();