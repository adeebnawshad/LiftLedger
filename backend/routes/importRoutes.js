import { Router } from "express";
import multer from "multer";
import { parseHevyCsv } from "../parsers/parseHevyCsv.js";
import { uploadCsv } from "../middleware/uploadCsv.js";

const router = Router();

/**
 * POST /api/import
 * Body: multipart/form-data, field name "file" (Hevy CSV export).
 * Step 1: accept file + parse; DB insert comes in a later step.
 */
router.post("/", uploadCsv.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Missing file. Send multipart field "file" with your Hevy CSV.',
    });
  }

  const csvText = req.file.buffer.toString("utf8");
  const result = parseHevyCsv(csvText);

  return res.status(200).json({
    fileName: req.file.originalname,
    byteSize: req.file.size,
    stats: result.stats,
    errors: result.errors,
    // Omit full rows for now — large exports would bloat the response.
    sampleRows: result.rows.slice(0, 3),
  });
});

/** Multer errors (size, file type) */
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "CSV file is too large (max 10 MB)"
        : err.message;
    return res.status(400).json({ error: message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;
