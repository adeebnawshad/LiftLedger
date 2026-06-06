import { Router } from "express";
import { getWeeklyVolume } from "../services/analyticsService.js";

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

export default router;
