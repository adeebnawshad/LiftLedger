import { Router } from "express";
import multer from "multer";
import { uploadCsv } from "../middleware/uploadCsv.js";
import { importHevyCsvToDb } from "../services/importHevyCsv.js";

const router = Router();

/**
 * POST /api/import
 * Body: multipart/form-data
 * - file: Hevy CSV export
 * - mode: "replace" (default) | "append"
 */
router.post("/", uploadCsv.single("file"), async (req, res, next) => { // without the single("file") middleware, req.file would be undefined
  // uploadCsv.single("file") is a middleware that uploads the file to the server and makes it available in req.file.
  // it also validates the file type and size.
  // it also reads the file into memory and makes it available in req.file.buffer.
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Missing file. Send multipart field "file" with your Hevy CSV.',
      });
    }

    const userId = process.env.DEFAULT_USER_ID;
    if (!userId) {
      return res.status(500).json({
        error: "DEFAULT_USER_ID is not configured. Run npm run db:seed and set it in .env.",
      });
    }

    const csvText = req.file.buffer.toString("utf8");
    const modeRaw = String(req.body?.mode ?? "replace").toLowerCase();
    const mode = modeRaw === "append" ? "append" : "replace";

    const result = await importHevyCsvToDb({
      csvText,
      fileName: req.file.originalname,
      userId,
      mode,
    });

    if (!result.ok) {
      return res.status(result.status ?? 500).json(result); // send the status code and the result
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err); // hand off to the error handler at the bottom
  }
});

/** Multer errors (size, file type) */
router.use((err, _req, res, next) => { // router.use is used to add middleware to the router. Middleware is a function that runs between the request and the response. If you pass 4 arguments, Express will treat it as error middleware (only runs when next(err) is called). If you pass 3 arguments, Express will treat it as regular middleware (runs on every request). 
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
