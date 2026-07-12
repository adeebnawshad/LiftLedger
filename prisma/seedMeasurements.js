import "dotenv/config";
import { prisma } from "../backend/prisma.js";

const userId = process.env.DEFAULT_USER_ID;
if (!userId) {
  console.error("Set DEFAULT_USER_ID in .env");
  process.exit(1);
}

/** Sample size progression aligned with demo periods (kg / cm). */
const SAMPLES = [
  { measuredAt: "2026-02-05", site: "BODY_WEIGHT", value: 79.2 },
  { measuredAt: "2026-02-19", site: "BODY_WEIGHT", value: 79.5 },
  { measuredAt: "2026-02-26", site: "BODY_WEIGHT", value: 79.8 },
  { measuredAt: "2026-03-10", site: "BODY_WEIGHT", value: 80.1 },
  { measuredAt: "2026-04-05", site: "BODY_WEIGHT", value: 80.4 },
  { measuredAt: "2026-04-18", site: "BODY_WEIGHT", value: 80.6 },
  { measuredAt: "2026-04-28", site: "BODY_WEIGHT", value: 80.9 },
  { measuredAt: "2026-02-05", site: "LEFT_ARM", value: 36.2 },
  { measuredAt: "2026-02-26", site: "LEFT_ARM", value: 36.4 },
  { measuredAt: "2026-04-18", site: "LEFT_ARM", value: 36.8 },
  { measuredAt: "2026-04-28", site: "LEFT_ARM", value: 37.0 },
  { measuredAt: "2026-02-05", site: "CHEST", value: 104.0 },
  { measuredAt: "2026-04-28", site: "CHEST", value: 105.2 },
];

async function main() {
  const removed = await prisma.bodyMeasurementEntry.deleteMany({ where: { userId } });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} existing measurement(s).`);
  }

  for (const row of SAMPLES) {
    await prisma.bodyMeasurementEntry.create({
      data: {
        userId,
        measuredAt: new Date(`${row.measuredAt}T12:00:00.000Z`),
        site: row.site,
        value: row.value,
      },
    });
  }

  console.log(`Seeded ${SAMPLES.length} body measurement entries.`);
}

main()
  .catch((err) => {
    console.error("Measurement seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
