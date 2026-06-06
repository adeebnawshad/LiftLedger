import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import importRoutes from "./routes/importRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is a security middleware that helps you protect your app by setting various HTTP headers
app.use(morgan("dev")); // morgan is a logging middleware that logs HTTP requests

app.get("/health", (_req, res) => {
  res.send("OK");
});

app.use("/api/import", importRoutes); // For any request whose URL starts with /api/import, run everything defined on importRoutes.
app.use("/api/analytics", analyticsRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);