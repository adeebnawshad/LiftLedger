# LiftLedger — forward plan (reclaim ownership)

**North star:** Every important line and decision becomes *yours* — you can explain it cold, break it on purpose, and fix it. The app already works; the work is understanding, not shipping more features (unless you choose to later).

**Receipts:** Original adopt goal (interview fluency + reclaim unreviwed polish); Phase 2 probes; parking lot; post-interview return (2026-08-01). Interview sprint blocks are done — this plan replaces that temporary focus.

---

## Inherited stack decisions


| Piece                        | Role                                                        | Your level                                                             | Revisit in |
| ---------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- | ---------- |
| **React**                    | UI: components, state, re-renders                           | Understood enough to pitch; still reclaim fetch-on-change / live debug | §4         |
| **Vite**                     | Dev server, HMR, `/api` proxy, production bundle            | Understood (with coach polish)                                         | §1         |
| **Express**                  | HTTP routes → services → DB                                 | Understood enough to pitch                                             | §2–3       |
| **PostgreSQL**               | Relational store for set-level history                      | Pitch OK; **why Postgres** asked in interview — own the tradeoff       | §1, §5     |
| **Prisma**                   | Schema, migrations, writes; `$queryRaw` for analytics       | Pitch OK; deepen “what Prisma is / isn’t”                              | §1, §5     |
| **JS backend / TS frontend** | Interview asked why split — own an honest answer            | Fuzzy → reclaim                                                        | §1         |
| **Deploy (AWS)**             | Resume: EC2 + S3/CloudFront (+ Neon/RDS); explain Free Tier | Wish → primary §9                                                      | §9         |


**Interview feedback (2026 interview):** They opened GitHub and drilled: schema + decisions, why Postgres, how the app runs (React `npm run dev` vs API vs DB), what Prisma is for, why JS on backend / TS on frontend, how you’d add pictures, plus more walkthrough questions. Sections below prioritize those gaps.

**Locked decision (deploy, 2026-08-04; updated same day):** **AWS is the primary deploy path** — resume signal matters. Target a small, explainable footprint you can talk through in interviews (not a giant multi-service architecture). Keep **Neon** for Postgres unless/until you deliberately move to RDS for the resume story. **Public multi-user** still needs auth (§8) first; a personal/private URL with `DEFAULT_USER_ID` is OK for a demo deploy. Cheap PaaS stays a fallback if Free Tier/time gets in the way — not the resume headline.

---



## Section 1 — Ground solid + “how it runs”

**Deliverable:** With the repo open (like they did), you can say:

- Frontend: `cd frontend && npm run dev` → Vite serves React (e.g. `:5173`), proxies `/api` to the backend  
- Backend: root `npm run dev` → Express (e.g. `:3000`)  
- Database: Postgres (Neon or local) — not started by Vite; app connects via `DATABASE_URL`  
- Why Postgres (relational, SQL aggregations, Prisma fit) vs a document store  
- Why Prisma (schema-as-code, migrations, typed client; still use raw SQL for some analytics)  
- Why JS backend / TS frontend today (honest history: how it was built; what you’d do next time)

**Reclaim:** `package.json` (both), `frontend/vite.config.ts`, `.env.example`, `backend/server.js` — explain from the files.

### Section 1 tasks

- [x] **1.1** Commit `learning/` so the curriculum can’t be lost (you write the commit message)
- [x] **1.2** Read root `package.json` — say what `npm run dev` starts; hit `/health` on the API
- [x] **1.3** Read `frontend/package.json` + `vite.config.ts` — say what the frontend dev server and `/api` proxy do; confirm the UI loads
- [x] **1.4** Read `.env.example` — explain `DATABASE_URL` and `DEFAULT_USER_ID` in your own words
- [x] **1.5** Cold pitch (repo open): three processes + why Postgres + what Prisma is + why JS backend / TS frontend

---



## Section 2 — CSV import, end to end (deep reclaim)

**Deliverable:** Trace upload → Multer → import route → parser → import service → DB **with the files open**, then again with them closed. You own every step you claim in interviews.

**Reclaim:** `backend/middleware/uploadCsv.js` + `backend/routes/importRoutes.js` + `backend/parsers/parseHevyCsv.js` — validation layers (file vs headers vs row); what “normalized set” means by reading one row path.

### Section 2 tasks

- [x] **2.1** Read `uploadCsv.js` — explain Multer memory storage, size limit, and file filter in your own words
- [x] **2.2** Read `importRoutes.js` — trace `req.file` → CSV text → `userId` / `mode` → call to import service
- [x] **2.3** Read `parseHevyCsv.js` headers/validation — what must be true before any row is trusted
- [x] **2.4** Follow one CSV row to a “normalized set” object — name the fields and why they exist
- [x] **2.5** Cold recall (files closed): recite upload → Multer → route → parser → service → DB

---



## Section 3 — Batching & replace/append (the unreviwed import path)

**Deliverable:** Explain the batch loop line-by-line; predict what happens if `WORKOUT_BATCH_SIZE` is 1 vs 1000; explain replace vs append deletes.

**Reclaim:** `backend/services/importHevyCsv.js` — the foggiest import piece from adopt. Break the batch size or skip replace wipe on purpose, predict failure, fix.

---



## Section 4 — React: load-on-change & live debug

**Deliverable:** Explain why `load(nextSite)` passes the new value; mount `useEffect` vs handler; fix a small deliberate bug without AI writing the fix for you.

**Reclaim:** `MeasurementChart.tsx` (and optionally scatter / `SetsByMuscleTable` chips) — the auto-reload path you didn’t fully review.

---



## Section 5 — Schema & Prisma client

**Deliverable:** Draw User → Workout → WorkoutSet → Exercise (+ Alias, CsvImport, Measurement) from memory; say why muscle lives on Exercise, not on each set. Answer “why Postgres” and “what is Prisma” without freezing. Explain the same model to a **non-technical** person (no jargon) and name the diagram type: simple **ER / boxes-and-arrows** (“has many” relationships), not a flowchart.

**Reclaim:** `prisma/schema.prisma` (comments already there as a study aid) + `backend/prisma.js` — how the app gets a DB client.

**Extension drill (they asked):** How would you add progress photos? — e.g. store image URL/path on a measurement or new `ProgressPhoto` table + object storage; don’t invent a half-baked design in the interview without saying “I’d start with…”

### Section 5 tasks

- [x] **5.1** With `schema.prisma` open: name the main models and which side holds the foreign keys (User→Workout→WorkoutSet→Exercise + Alias, CsvImport, Measurement)
- [x] **5.2** Why muscle / type / strength live on **Exercise**, not on each `WorkoutSet`
- [x] **5.3** Cold draw (files closed): ER boxes-and-arrows from memory
- [x] **5.4** Non-technical explanation of the same model + name the diagram type
- [x] **5.5** Quick recall: why Postgres + what Prisma is / isn’t (tie to this schema)

---



## Section 6 — One analytics SQL path (volume)

**Deliverable:** Read `getWeeklyVolume` / the raw query; explain GROUP BY week + muscle + exerciseType; how the frontend pivots all-muscles vs compound/isolation.

**Reclaim:** `backend/services/analyticsService.js` + `frontend/src/lib/weeklyVolume.ts` + `WeeklyVolumeChart.tsx` — parked chart code → known.

---



## Section 7 — Exercise classification (regex rules)

**Deliverable:** Walk one name through overrides → regex → muscle/type/strength; fix or document one wrong uncommon mapping.

**Reclaim:** `prisma/lib/classifyExercise.js` + seed-from-CSV path — parking-lot item.

---



## Section 8 — Optional later (only if you ask)

- Auth / multi-user (production gap you already named) — **required before inviting strangers** to a public deploy
- CSS theme reclaim (low ownership leverage)
- Async import jobs
- New features after reclaim debt is down

---



## Section 9 — Deploy on AWS (resume-oriented)

**When:** After you’re solid on §1 (how it runs + env secrets). Ideal after §2–3 so you can demo a real CSV import on the live URL. **Does not jump ahead of §2** unless you explicitly pull it forward — reclaim import still pays more ownership than hosting config.

**Why AWS:** So you can put real service names on a resume and explain them: e.g. **EC2** (or Elastic Beanstalk) for Express, **S3 + CloudFront** for the Vite static build, env/secrets on the host, Neon (or RDS) for Postgres. Interviewers care that you can draw the boxes — not that you used every AWS product.

**Deliverable:** LiftLedger reachable on the internet via AWS-hosted pieces. You can explain the architecture cold, name what Free Tier covers vs what costs money, and demo UI + API health (optional: one CSV import). Browser never gets `DATABASE_URL`.

**Concepts (≈3–7):** `vite build` → static assets; S3 website/CloudFront; EC2 (or Beanstalk) process for Express; security group / ports; host env vars; CORS / API base URL (Vite proxy is **dev-only**); Free Tier limits; personal deploy vs public+auth.

**Build path (default):**

1. Neon stays the DB (simplest; still honest on a resume as “Postgres on Neon, app on AWS”)
2. S3 (+ CloudFront if you want HTTPS/CDN) for frontend `dist/`
3. EC2 free-tier-sized instance runs Express with `DATABASE_URL` + `DEFAULT_USER_ID`
4. Optional later resume upgrade: swap Neon → **RDS Postgres** once the app path is proven

**Reclaim task (one):** You configure the AWS pieces and the prod API URL for the frontend — every new file/env/console setting is something you can explain.

**Trade if pulled early:** §2 CSV reclaim waits; live AWS URL sooner, less import-path depth for interviews.

**Resume line (honest):** “Deployed full-stack training app on AWS (EC2 API, S3/CloudFront static UI, Postgres)” — only after you’ve actually done it and can defend it.

---



## How lessons work from here

Run `/next-lesson`. Each section becomes 3–7 small tasks; each task ends with something you can demo or say out loud. **Never ship a line you can’t explain — including lines Cursor wrote.**