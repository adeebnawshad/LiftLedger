// run with: npm run test:parse

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHevyCsv } from "../parsers/parseHevyCsv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // __dirname is the directory name of the current module
const fixturePath = path.join(__dirname, "../fixtures/hevy-sample.csv"); // path.join is used to join the directory name with the file name

const csv = fs.readFileSync(fixturePath, "utf8");
const result = parseHevyCsv(csv);

console.log("Stats:", result.stats);
console.log("Errors:", result.errors);
console.log("Rows:");
for (const row of result.rows) {
  console.log(
    `  [${row.sourceRow}] ${row.workoutTitle} | ${row.exerciseTitle} | order=${row.orderIndex} setIdx=${row.setIndexInExercise} | ${row.setKind} ${row.weightLbs ?? "BW"}lb ${row.reps != null ? `x${row.reps}` : `${row.durationSeconds}s`}`,
  );
}

// sourceRow starts at 2 because the first row is the header, index starts at 0, SourceRow = index + 2, so error messages match the row number in the CSV