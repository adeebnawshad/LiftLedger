# LiftLedger — knowledge graph

Statuses: `seed` → `introduced` → `practicing` → `understood`  
Evidence only from conversation (Phase 2 probes, 2026-07-26). Cap at `practicing` on first contact.

---

## [[csv-import-pipeline]]
- **status:** practicing
- **depends-on:** [[multipart-upload]], [[batched-writes]], [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Walked upload → POST → parse → group → alias skip → replace/append → batch insert → stats in own words; corrected “40 rows” → workouts and service vs route.

## [[multipart-upload]]
- **status:** practicing
- **depends-on:** [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Described middleware receiving the file and attaching it for the import route (`req.file`).

## [[batched-writes]]
- **status:** introduced
- **depends-on:** [[prisma-orm]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Named batching so huge files don’t time out one giant transaction; refined to ~40 workouts.

## [[react-state-fetch]]
- **status:** practicing
- **depends-on:** [[react-vite]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Explained dropdown handler sets site and calls `load`; corrected that fetch is direct from handler, re-render follows state updates; asked why state isn’t immediate.

## [[sql-aggregation]]
- **status:** practicing
- **depends-on:** [[normalized-schema]], [[prisma-orm]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Sets-by-muscle and volume: data from DB via SQL with conditions; volume aggregates sets by muscle.

## [[weekly-volume]]
- **status:** introduced
- **depends-on:** [[sql-aggregation]], [[exercise-classification]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Stacked bars from aggregated sets per muscle; isolate-to-compound/isolation still thin (not probed in depth).

## [[calendar-span-avg]]
- **status:** practicing
- **depends-on:** [[weekly-volume]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Said avg/week divides by weeks in the selected period so empty weeks don’t inflate; coach refined to days÷7 calendar span.

## [[e1rm]]
- **status:** practicing
- **depends-on:** [[sql-aggregation]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Point = max e1RM in a Mon-start week; % vs first point in selected period.

## [[sets-by-muscle]]
- **status:** introduced
- **depends-on:** [[sql-aggregation]], [[rest-api]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Described per-set rows (date, exercise, weight, reps) for muscle in range via SQL; API middle layer noted by coach.
- **note:** Target of next feature — exercise filter chips.

## [[env-config]]
- **status:** practicing
- **depends-on:** —
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-08-03
- **evidence:** Named default user id from `.env` for imports. Review 2026-08-03: “no auth yet, placeholder user.”

## [[vite-proxy]]
- **status:** introduced
- **depends-on:** [[react-vite]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** Said Vite proxies API to Express localhost:3000 during import walkthrough.

## [[rest-api]]
- **status:** introduced
- **depends-on:** [[node-express]]
- **introduced:** 2026-07-26
- **last-reviewed:** 2026-07-26
- **evidence:** POST import endpoint; understanding that charts hit API then SQL.

## [[node-express]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[react-vite]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[react-router]]
- **status:** seed
- **depends-on:** [[react-vite]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[prisma-orm]]
- **status:** seed
- **depends-on:** [[normalized-schema]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

## [[normalized-schema]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** —

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
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (repo has git; practice missing from probes)

## [[testing]]
- **status:** seed
- **depends-on:** —
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (absent / not load-bearing yet; curriculum gap)

## [[auth]]
- **status:** seed
- **depends-on:** [[env-config]]
- **introduced:** —
- **last-reviewed:** —
- **evidence:** — (missing; DEFAULT_USER_ID stand-in)
