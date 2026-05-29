/**
 * Print what csv-parse sees for one spreadsheet row (row 1 = header).
 * Usage: node backend/scripts/debugCsvRow.js path/to/workouts.csv 606
 */
import fs from "node:fs";
import { parse } from "csv-parse/sync";

const filePath = process.argv[2];
const rowNum = Number(process.argv[3]);

if (!filePath || !Number.isFinite(rowNum) || rowNum < 2) {
  console.error("Usage: node backend/scripts/debugCsvRow.js <csv-file> <row-number>");
  console.error("Example: node backend/scripts/debugCsvRow.js workouts.csv 606");
  process.exit(1);
}

const csv = fs.readFileSync(filePath, "utf8");
const records = parse(csv, {
  columns: (header) => header.map((h) => String(h).trim().replace(/^\ufeff/, "")),
  skip_empty_lines: true,
  trim: true,
  relax_column_count: false,
});

const index = rowNum - 2;
const record = records[index];

console.log(`File: ${filePath}`);
console.log(`Spreadsheet row: ${rowNum} (data index ${index})`);
console.log("\nParsed object:");
console.log(JSON.stringify(record, null, 2));
console.log("\nKey fields:");
console.log("  exercise_title:", record?.exercise_title ?? "(missing)");
console.log("  reps:", record?.reps ?? "(missing)");
console.log("  distance_km:", record?.distance_km ?? "(missing)");
console.log("  duration_seconds:", record?.duration_seconds ?? "(missing)");
console.log("  duration_s:", record?.duration_s ?? "(missing)");
console.log("  rpe:", record?.rpe ?? "(missing)");
