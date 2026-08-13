# LiftLedger — project brief

## About me

I built LiftLedger with **Cursor Pro**: I decided the features, used mockups from Claude, then asked Cursor to plan and implement step by step because I was new to this stack. I reviewed nearly every line (asking until I understood) before moving on — except late polish (CSS, CSV batching path, measurement/scatter auto-reload on site change), which I shipped without a full line-by-line pass.

Primary goal for adopting this project: **reclaim ownership** of Cursor-written code and design decisions — explain data flow, CSV parse/import, analytics SQL, and React behavior without needing the file open; get comfortable breaking and fixing React/backend bugs yourself. Interview fluency is a byproduct, not the only north star.

## The idea

A personal training-analytics app for recreational lifters/bodybuilders who already log in **Hevy**. Import a Hevy CSV → parse and store set-level history → map exercises to muscle groups → charts for weekly volume, strength trends (e1RM + % vs first week in range), and body measurements over time (plus same-day scatters).

**Who it's for:** me (and lifters like me) — not a multi-tenant SaaS yet.

## MVP

### In (working)

- Hevy CSV import (replace / append)
- Exercise library seeded from CSV titles + rule-based muscle/type/strength classification
- Weekly volume charts (SQL aggregation, muscle stacks, click-to-isolate → compound vs isolation)
- Strength trends (estimated 1RM / max reps, % from first week in range)
- Sets-by-muscle raw log + exercise filter chips (click to isolate one exercise in range)
- Body measurement logging + trend charts + bodyweight/waist scatter views
- Express REST API + Prisma/Postgres + React/Vite dashboard
- README with screenshots; real-scale import (~650 workouts / ~10k+ sets)

### Frozen

_(none — no half-built feature branches to freeze)_

### Parking lot

- Fix wrong muscle mappings for uncommon exercises (rules or manual overrides)
- Reclaim unreviwed: CSV batching import path, measurement/scatter auto-reload on dropdown change, CSS polish
- Interview fluency: CSV parser validation/data flow from memory; React live-debug practice
- Possible later (not MVP for adopt): auth/multi-user, async import queue, period A/B insights UI, **AWS deploy (§9 — EC2 + S3/CloudFront; resume-oriented)**

## Triage decision

**Adopt** — keep the whole working app; map it; plan forward around **reclaiming** foggy spots so the codebase is yours.

**Reasoning:** The product already runs and matches a clear personal MVP. Gaps are understanding depth and unreviwed polish (batching, site auto-reload, CSS), not a pile of broken features. Interview prep was a temporary sprint; long-term curriculum is ownership via reclaim tasks.
