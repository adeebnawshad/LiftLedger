import { Router } from "express";
import {
  getLoggedExercises,
  getSetsByMuscleGroup,
  getStrengthTrends,
  getWeeklyVolume,
} from "../services/analyticsService.js";
import { getPeriodInsights } from "../services/insightsService.js";
import { getMeasurementTrends } from "../services/measurementService.js";

const router = Router();

/**
 * GET /api/analytics/weekly-volume
 *
 * Query params (use one mode):
 * - weeks: rolling lookback from current week (default 12)
 * - start + end: inclusive YYYY-MM-DD range for historical analysis
 *
 * Examples:
 *   /api/analytics/weekly-volume?weeks=12
 *   /api/analytics/weekly-volume?start=2025-04-01&end=2025-06-30
 */
router.get("/weekly-volume", async (req, res, next) => {
  try {
    const weeksRaw = req.query.weeks; // req.query is an object that contains the query parameters of the request. weeks is the query parameter name.
    const weeks = weeksRaw != null ? Number(weeksRaw) : 12; // if weeksRaw is not null, convert it to a number. If it's null, set it to 12. (this is a default value if no weeks parameter is provided). Not an issue if start and end are provided, as in that case, weeks is ignored in resolveRange().
    const start = req.query.start;
    const end = req.query.end;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    const result = await getWeeklyVolume({ userId, weeks, start, end });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/logged-exercises?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Distinct exercises with rep+weight sets in range (strength chart picker).
 */
router.get("/logged-exercises", async (req, res, next) => {
  try {
    const start = req.query.start;
    const end = req.query.end;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        ok: false,
        error: "Provide start and end (YYYY-MM-DD).",
      });
    }

    const result = await getLoggedExercises({
      userId,
      start: String(start),
      end: String(end),
    });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/strength-trends?exerciseId=...&start=...&end=...
 * Weekly max estimated 1RM (kg) for one exercise.
 */
router.get("/strength-trends", async (req, res, next) => {
  try {
    const weeksRaw = req.query.weeks;
    const weeks = weeksRaw != null ? Number(weeksRaw) : 12;
    const start = req.query.start;
    const end = req.query.end;
    const exerciseId = req.query.exerciseId;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    const result = await getStrengthTrends({
      userId,
      exerciseId: exerciseId ? String(exerciseId) : "",
      weeks,
      start: start != null ? String(start) : undefined,
      end: end != null ? String(end) : undefined,
    });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err); // if an error occurs, pass it to the next middleware function
  }
});

/**
 * GET /api/analytics/period-insights?startA&endA&startB&endB&exerciseId?
 * Rule-based comparison of volume and strength across two periods.
 */
router.get("/period-insights", async (req, res, next) => {
  try {
    const { startA, endA, startB, endB, exerciseId } = req.query;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    if (!startA || !endA || !startB || !endB) {
      return res.status(400).json({
        ok: false,
        error: "Provide startA, endA, startB, and endB (YYYY-MM-DD).",
      });
    }

    const result = await getPeriodInsights({
      userId,
      startA: String(startA),
      endA: String(endA),
      startB: String(startB),
      endB: String(endB),
      exerciseId: exerciseId ? String(exerciseId) : undefined,
    });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/measurements?site=BODY_WEIGHT&start&end
 * Weekly average body measurement trend.
 */
router.get("/measurements", async (req, res, next) => {
  try {
    const { site, start, end } = req.query;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        ok: false,
        error: "Provide start and end (YYYY-MM-DD).",
      });
    }

    const result = await getMeasurementTrends({ // get weekly average body measurement in a date range
      userId,
      site: site ? String(site) : "BODY_WEIGHT",
      start: String(start),
      end: String(end),
    });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/analytics/sets-by-muscle-group?muscleGroup=...&start=...&end=...
 * Sets by muscle group in a date range.
 */
router.get("/sets-by-muscle-group", async (req, res, next) => {
  try {
    const { muscleGroup, start, end } = req.query;

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        ok: false,
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    if (!start || !end) {
      return res.status(400).json({
        ok: false,
        error: "Provide start and end (YYYY-MM-DD).",
      });
    }
    
    const result = await getSetsByMuscleGroup({
      userId,
      muscleGroup: muscleGroup ? String(muscleGroup) : "",
      start: String(start),
      end: String(end),
    });

    if (!result.ok) {
      return res.status(result.status ?? 400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
