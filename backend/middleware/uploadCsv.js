import multer from "multer";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

/** In-memory upload — CSV string is read from req.file.buffer in the route. */
export const uploadCsv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const name = (file.originalname || "").toLowerCase();
    const okMime =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "text/plain" ||
      file.mimetype === "application/octet-stream";

    if (name.endsWith(".csv") || okMime) {
      cb(null, true);
      return;
    }
    cb(new Error("Only .csv files are allowed"));
  },
});
