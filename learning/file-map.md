# LiftLedger — file map

Honest ledger from Phase 2 probes (2026-07-26).  
Statuses: `known` = explained in own words during probes · `parked` = exists, not yet explained cold · `generated` = machine-made, never edit by hand.

Grain: folders stay one line until we open them for a lesson.

## Root

| Path | Status | Why it exists |
| --- | --- | --- |
| `package.json` | known | Root scripts + deps; `npm run dev` → nodemon → Express API → [[node-express]] |
| `package-lock.json` | generated | Exact dependency versions; rebuild via `npm install` |
| `.env` | known | Local secrets loaded by dotenv into `process.env` (not committed) → [[env-config]] |
| `.env.example` | known | Safe template in git: `PORT`, `DATABASE_URL`, `DEFAULT_USER_ID` → [[env-config]] |
| `.gitignore` | parked | Keeps secrets/build junk out of git |
| `README.md` | parked | How to run + screenshots for portfolio |
| `prisma.config.ts` | parked | Prisma tooling config → [[prisma-orm]] |
| `skills-lock.json` | parked | Agent skill lockfile (not app runtime) |
| `.agents/` | parked | Cursor/agent skills — not the product |
| `.claude/` | parked | Claude skill copies — not the product |
| `learning/` | known | Adopt curriculum artifacts (you + coach) |
| `learning/interview-sprint.md` | known | Temporary interview priority checklist (does not replace plan.md) |
| `node_modules/` | generated | Installed packages; never edit; rebuild with `npm install` |
| `generated/` | generated | Tooling output; rebuildable |

## Backend (`backend/`)

| Path | Status | Why it exists |
| --- | --- | --- |
| `backend/server.js` | known | Express entry: listens on PORT, `/health` returns OK; routes still deeper in §2–3 → [[node-express]] [[rest-api]] |
| `backend/prisma.js` | parked | Shared Prisma client for DB access → [[prisma-orm]] |
| `backend/routes/` | parked | HTTP endpoints (import, analytics, measurements) → [[rest-api]] |
| `backend/routes/importRoutes.js` | known | POST import: Multer → buffer→text → userId/mode → import service; fail statuses if `!result.ok` → [[csv-import-pipeline]] [[rest-api]] |
| `backend/middleware/uploadCsv.js` | known | Multer: RAM buffer, 10 MB cap, CSV/MIME filter → [[multipart-upload]] |
| `backend/parsers/parseHevyCsv.js` | known | Pure parse: validate headers, skip bad rows, CSV → normalized set objects + orderIndex → [[csv-import-pipeline]] |
| `backend/parsers/` (other) | parked | Date/set-kind helpers for the parser |
| `backend/services/importHevyCsv.js` | known | Group workouts, alias map, replace/append, **batch insert** → [[csv-import-pipeline]] [[batched-writes]] |
| `backend/services/analyticsService.js` | known | SQL for volume / strength / sets-by-muscle → [[sql-aggregation]] [[e1rm]] |
| `backend/services/measurementService.js` | parked | Measurement create + trend/scatter queries → [[body-measurements]] |
| `backend/routes/analyticsRoutes.js` | parked | Wires analytics URLs to the service → [[rest-api]] |
| `backend/routes/measurementRoutes.js` | parked | POST measurements → [[rest-api]] |
| `backend/fixtures/` | parked | Sample `workouts.csv` for seeding |
| `backend/scripts/` | parked | One-off test/debug scripts for CSV |

## Frontend (`frontend/`)

| Path | Status | Why it exists |
| --- | --- | --- |
| `frontend/package.json` | known | Frontend scripts; `npm run dev` → Vite → [[react-vite]] |
| `frontend/vite.config.ts` | known | Dev server; `/api` (and `/health`) proxy to Express :3000 → [[vite-proxy]] |
| `frontend/src/main.tsx` | parked | React entry |
| `frontend/src/App.tsx` | parked | Routes + shell/nav → [[react-router]] |
| `frontend/src/index.css` | parked | Theme/layout (unreviewed polish) → [[css-theme]] — reclaim later |
| `frontend/src/pages/` | parked | Dashboard, Log data, Sets by muscle pages |
| `frontend/src/pages/SetsByMusclePage.tsx` | parked | Hosts sets-by-muscle tables — **feature work lands near here** |
| `frontend/src/components/CsvUpload.tsx` | known | Upload UI → POST import → [[csv-import-pipeline]] |
| `frontend/src/components/MeasurementChart.tsx` | known | Size chart; site change calls `load(nextSite)` → [[react-state-fetch]] |
| `frontend/src/components/MeasurementScatter.tsx` | parked | BW vs girth; same auto-load pattern → [[react-state-fetch]] |
| `frontend/src/components/WaistMeasurementScatter.tsx` | parked | Waist vs girth scatter |
| `frontend/src/components/WeeklyVolumeChart.tsx` | parked | Stacked volume + muscle isolate → [[weekly-volume]] [[calendar-span-avg]] |
| `frontend/src/components/StrengthTrendChart.tsx` | parked | e1RM line + % from first week → [[e1rm]] |
| `frontend/src/components/SetsByMuscleTable.tsx` | parked | Raw set log UI + exercise filter chips (uncommitted) → [[sets-by-muscle]] — reclaim §4 |
| `frontend/src/components/MeasurementUpload.tsx` | parked | Manual measurement form |
| `frontend/src/lib/` | parked | Fetch helpers, chart theme, weekly-volume math |
| `frontend/src/lib/weeklyVolume.ts` | known | Calendar-span averages (explained in probe) → [[calendar-span-avg]] |
| `frontend/src/lib/strengthTrends.ts` | parked | % from first week helper → [[e1rm]] |
| `frontend/src/types/` | parked | TypeScript shapes for API data |
| `frontend/node_modules/` | generated | Frontend packages |
| `frontend/public/` | parked | Favicon / static assets |
| `frontend/dist/` | generated | Production build output (if present) |

## Database (`prisma/`)

| Path | Status | Why it exists |
| --- | --- | --- |
| `prisma/schema.prisma` | known | Tables/enums + FKs: User→Workout→WorkoutSet→Exercise (+ Alias, CsvImport, Measurement) → [[normalized-schema]] [[prisma-orm]] |
| `prisma/migrations/` | parked | Versioned DB changes |
| `prisma/seed.js` | parked | Default user + triggers exercise seed |
| `prisma/seedExercisesFromCsv.js` | parked | Build exercise library from Hevy titles → [[exercise-classification]] |
| `prisma/lib/classifyExercise.js` | parked | Rules: muscle / compound / strength mode → [[exercise-classification]] |
| `prisma/lib/` (other) | parked | Alias normalize, CSV title merges |
| `prisma/data/exercises.js` | parked | Old hand-curated seed (largely superseded by CSV seed) |

## Docs

| Path | Status | Why it exists |
| --- | --- | --- |
| `docs/screenshots/` | parked | README images |
