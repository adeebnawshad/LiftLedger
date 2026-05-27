import { prisma } from "../backend/prisma.js";
import { seedExercises } from "./seedExercises.js";

const SEED_EMAIL = "local@liftledger.dev";
const SEED_PASSWORD_HASH = "v1-no-auth-placeholder";
const SEED_NAME = "Local User";

async function main() {
  // Remove broken rows (empty id from Studio/Neon) and any prior seed user.
  const removed = await prisma.user.deleteMany({
    where: {
      OR: [{ id: "" }, { email: SEED_EMAIL }],
    },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} existing User row(s).`);
  }

  const user = await prisma.user.create({
    data: {
      email: SEED_EMAIL,
      passwordHash: SEED_PASSWORD_HASH,
      name: SEED_NAME,
    },
  });

  console.log("Seeded default user:");
  console.log(`  id:    ${user.id}`);
  console.log(`  email: ${user.email}`);
  console.log("");
  console.log("Add to your .env:");
  console.log(`  DEFAULT_USER_ID=${user.id}`);
  console.log("");

  await seedExercises();
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
