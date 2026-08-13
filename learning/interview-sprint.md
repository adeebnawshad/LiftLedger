# Interview sprint (temporary)

**Purpose:** Compress reclaim work for an interview in a few days.  
**Does not replace** `learning/plan.md` — after the interview, return to the full reclaim path (esp. §3–4 break/fix drills, §9 AWS).

**Rule:** Don’t redo finished tasks from scratch. Use cold recall / timed pitch. Only reopen a file if cold recall shows a hole.

---

## Priority A — do fully

### §1 How it runs (already done 1.1–1.5)

- [x] Tasks complete in plan  
- [ ] **Sprint drill:** timed cold pitch, files closed — 3 processes; why Postgres; what Prisma is / isn’t; why JS backend / TS frontend  

### §2 CSV import (most likely deep dive)

- [x] 2.1–2.4 done  
- [x] **2.5** Cold recall, files closed: upload → Multer → route → parser → service → DB  
- Patch only the steps you blank on; do not restart 2.1–2.4  

### §5 Schema (high interview value)

- [x] Draw from memory: User → Workout → WorkoutSet → Exercise (+ Alias, CsvImport, Measurement)
- [x] Why muscle lives on **Exercise**, not each set  
- [x] Why Postgres + what Prisma is (no freeze)
- [x] Explain same model to a **non-technical** person; diagram type = ER / boxes-and-arrows  
- [ ] Optional: “how would you add progress photos?” (start with… URL/path + object storage)

---

## Priority B — lighter pass (explain only; skip break-it / fix-without-AI)

### §3 Batching & replace/append

- [ ] Explain **replace** vs **append** (what gets deleted)  
- [ ] Explain why **~40 workouts/batch** (timeouts on one giant txn)  
- [ ] Skim batch loop once with file open if needed  
- [ ] **Skip:** deliberately break `WORKOUT_BATCH_SIZE` and live-debug  

### §4 React load-on-change

- [ ] Explain why **`load(nextSite)`** (state alone doesn’t fetch; stale closure)  
- [ ] Mount `useEffect` vs change handler  
- [ ] **Skip:** deliberate bug hunt without AI (Sunday spare time only)  

---

## Priority C — compress (~15 min each)

### §6 Weekly volume

Verbal shape only:

> Grouped in SQL by week + muscle + exerciseType; frontend pivots all-muscles vs compound/isolation. Done in SQL because set-level history is large and aggregations belong near the data.

### §7 Exercise classification

Verbal shape only:

> Seed-time rule layer (overrides + regex) maps Hevy titles → muscle / compound-isolation / strength mode. Import resolves **alias → exerciseId**; it does not re-classify every row.

---

## Add-ons (not in main plan sections)

### Weakest part / what I’d do differently

Pick **one** real answer and practice it cold. Examples:

- Regex classification is brittle for uncommon names → prefer richer override table / manual review UI  
- No auth / single `DEFAULT_USER_ID` → not multi-user safe  
- JS backend / TS frontend → unify on TypeScript next time  

### JD parallel (ingestion → platform)

One sentence ready:

> LiftLedger’s pipeline is validate → normalize → batch-write — the same shape you’d want for a post-processing / data ingestion path.

(Customize wording to their JD once you have the posting open.)

### Deploy / AWS honesty

- [ ] Fact: is it deployed anywhere today? (likely: local / Neon DB only)  
- [ ] One-liner: currently runs locally with Postgres on Neon; for AWS I’d put the API on EC2 (or similar), static UI on S3 (+ CloudFront), keep Neon or move to RDS — and I wouldn’t invite strangers without auth  

---

## Suggested time budget (one focused day)

| Block | Time |
| --- | --- |
| §1 cold pitch + §2.5 cold recall | ~45–60 min |
| §5 schema drills | ~60–90 min |
| Light §3 / §4 / §6 / §7 | ~60 min |
| Weakest part + JD line + deploy line | ~20 min |
| **Total** | **~3–3.5 hrs** |

---

## After the interview

Resume `learning/plan.md` from remaining reclaim (full §3–4 drills, deeper §6–7, §9 AWS). This file can stay as a checklist archive or be deleted.
