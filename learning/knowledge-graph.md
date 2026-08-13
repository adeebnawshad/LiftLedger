# LiftLedger — knowledge graph

Statuses: `seed` → `introduced` → `practicing` → `understood`  
Evidence only from conversation (Phase 2 probes, 2026-07-26). Cap at `practicing` on first contact.

---

## [[csv-import-pipeline]]
- **status:** practicing
- **depends-on:** [[multipart-upload]], [[batched-writes]], [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** §2.5 cold recall: full pipeline in own words (POST→Multer→route→parser→alias→group→batch). Coach: alias lookup not muscle mapping; replace deletes first; CsvImport audit + response stats.

## [[multipart-upload]]
- **status:** practicing
- **depends-on:** [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-05
- **evidence:** Named Multer on import route. 2026-08-05 §2.1: `memoryStorage` → `req.file.buffer` in process RAM; `fileSize` 10 MB; `fileFilter` accepts `.csv` or allowed MIME types.

## [[batched-writes]]
- **status:** practicing
- **depends-on:** [[prisma-orm]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-05
- **evidence:** Named batching so huge files don’t time out one giant transaction; refined to ~40 workouts. Review 2026-08-05: “giant database transaction times out.”

## [[react-state-fetch]]
- **status:** practicing
- **depends-on:** [[react-vite]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-06
- **evidence:** Explained dropdown handler sets site and calls `load`. Review 2026-08-06: setting state alone doesn’t fetch; handler must call `load(nextSite)`.

## [[sql-aggregation]]
- **status:** practicing
- **depends-on:** [[normalized-schema]], [[prisma-orm]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** Sets-by-muscle and volume from DB via SQL. Review 2026-08-07: said aggregation in database/SQL; coached that “browser shouldn’t talk to DB” is true but the SQL-vs-JS reason is large set history + GROUP BY near the data.

## [[weekly-volume]]
- **status:** practicing
- **depends-on:** [[sql-aggregation]], [[exercise-classification]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** Stacked bars from aggregated sets per muscle. Review 2026-08-07: compound vs isolation split; label lives on Exercise (`exerciseType`).

## [[calendar-span-avg]]
- **status:** practicing
- **depends-on:** [[weekly-volume]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** Said avg/week uses calendar span so empty weeks don’t inflate. Review 2026-08-07: calendar span of selected range — avoid higher-than-actual avg (vs only counting weeks trained).

## [[e1rm]]
- **status:** practicing
- **depends-on:** [[sql-aggregation]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** Point = max e1RM in a Mon-start week; % vs first point. Review 2026-08-07: strength mode (e1RM vs max reps) lives on Exercise, not each set.

## [[sets-by-muscle]]
- **status:** practicing
- **depends-on:** [[sql-aggregation]], [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-07
- **evidence:** Described per-set rows for muscle in range. Review 2026-08-07: individual logged sets (not weekly aggregates).

## [[env-config]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-03
- **evidence:** Named default user id from `.env` for imports. Review: “no auth yet, placeholder user.” 2026-08-03 §1.4: `.env.example` in git with placeholders, `.env` secrets not committed; `DATABASE_URL` connects to Postgres; `DEFAULT_USER_ID` stand-in; seed creates that user in the DB. Own words: clone→their DB (you can’t see uploads); your deploy→your Neon (you can still see rows even with auth); users never get your URL — only the server process has it.

## [[vite-proxy]]
- **status:** practicing
- **depends-on:** [[react-vite]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-03
- **evidence:** Said Vite proxies API to Express :3000. 2026-08-03: “forwards the request to http://localhost:3000 instead.”

## [[rest-api]]
- **status:** practicing
- **depends-on:** [[node-express]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-06
- **evidence:** POST import; charts hit API then SQL. Predicted `/health` → OK. Review: browser → Express → Postgres, not direct to DB. 2026-08-06 §2.2: traced import route handler before service call.

## [[node-express]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-08-03
- **last-reviewed:** 2026-08-04
- **evidence:** Root `npm run dev` → Express :3000. 2026-08-04 cold pitch: named root + frontend `npm run dev`; corrected that DB is separate via `DATABASE_URL`. Honest: JS backend was scaffold default; would prefer TS next time for shared types.

## [[react-vite]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-08-03
- **last-reviewed:** 2026-08-04
- **evidence:** Frontend `npm run dev` → Vite :5173 + dashboard. 2026-08-04: TS frontend from Vite react-ts default; not a deep JS-vs-TS split decision.

## [[react-router]]
- **status:** seed
- **depends-on:** [[react-vite]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[prisma-orm]]
- **status:** practicing
- **depends-on:** [[normalized-schema]]
- **introduced:** 2026-08-04
- **last-reviewed:** 2026-08-13
- **evidence:** §5.5: ORM; schema; migrations → SQL → DB; client for inserts/CRUD; raw SQL still used for aggregations; not a full SQL replacement.

## [[normalized-schema]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-08-04
- **last-reviewed:** 2026-08-13
- **evidence:** §5.3–5.4 ER. §5.5: Postgres because relational + SQL aggregates; document DB awkward for cross-cutting week/muscle joins (not impossible).

## [[exercise-classification]]
- **status:** seed
- **depends-on:** [[normalized-schema]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (parking lot: wrong mappings for uncommon exercises)

## [[body-measurements]]
- **status:** seed
- **depends-on:** [[rest-api]], [[react-state-fetch]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[css-theme]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (explicitly unreviwed polish)

## [[git-workflow]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-08-03
- **last-reviewed:** 2026-08-03
- **evidence:** Staged only `learning/`, wrote commit message, confirmed untracked cleared; left other WIP unstaged on purpose.


## [[testing]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (absent / not load-bearing yet; curriculum gap)

## [[auth]]
- **status:** introduced
- **depends-on:** [[env-config]]
- **introduced:** 2026-08-03
- **last-reviewed:** 2026-08-03
- **evidence:** Explained DEFAULT_USER_ID as placeholder/dummy user because there is no authentication yet; routes need a user id to scope data.
