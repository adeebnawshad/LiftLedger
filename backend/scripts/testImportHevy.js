/**
 * Dry-run import against the fixture (requires DATABASE_URL + DEFAULT_USER_ID).
 * Usage: node backend/scripts/testImportHevy.js
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importHevyCsvToDb } from "../services/importHevyCsv.js";
import { prisma } from "../prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(__dirname, "../fixtures/hevy-sample.csv");

const userId = process.env.DEFAULT_USER_ID;
if (!userId) {
  console.error("Set DEFAULT_USER_ID in .env (from npm run db:seed)");
  process.exit(1);
}

const csvText = fs.readFileSync(fixturePath, "utf8");
const result = await importHevyCsvToDb({
  csvText,
  fileName: "hevy-sample.csv",
  userId,
});

console.log(JSON.stringify(result, null, 2)); // convert the result object to a JSON string with 2 spaces for indentation. null is a placeholder for "no replacement" when you don't want to replace a value.  without null, the result object would be printed as a single line. So this prints result as pretty-printed JSON in the terminal/console.

await prisma.$disconnect();
