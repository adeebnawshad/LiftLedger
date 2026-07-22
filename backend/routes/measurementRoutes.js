import { Router } from "express";
import { createMeasurementEntry } from "../services/measurementService.js";

const router = Router();

/**
 * POST /api/measurements
 * Body: { site, value, measuredAt }
 */
router.post("/", async (req, res, next) => {
  try {
    const { site, value, measuredAt, notes } = req.body;
    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }
    const result = await createMeasurementEntry({
      userId,
      site,
      value,
      measuredAt,
      notes,
    });
    if (result.ok) {
      return res.status(201).json(result.entry);
    } else {
      return res.status(result.status ?? 500).json({ error: result.error });
    }
  } catch (error) {
    next(error);
  }
});

export default router;