import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { checkDatabaseConnection } from "./db.js";
import adminRouter from "./routes/admin.js";
import bookingsRouter from "./routes/bookings.js";
import contactRouter from "./routes/contact.js";
import jobsRouter from "./routes/jobs.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Trust first proxy in production (Render / Railway / Fly.io / reverse proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  "http://localhost:5173,http://127.0.0.1:5173,https://bahrain-nursing-care.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin or server-to-server requests with no Origin header
      if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS policy"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(cookieParser());

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
});

// Public form submission rate limiter
const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions from this IP. Please try again later." },
});

app.use("/api", apiLimiter);

// Health-check endpoint
app.get("/api/health", async (_req, res) => {
  const dbStatus = await checkDatabaseConnection();
  const statusCode = dbStatus.connected ? 200 : 503;
  return res.status(statusCode).json({
    status: dbStatus.connected ? "ok" : "degraded",
    service: "noor-al-afiya-api",
    database: dbStatus.connected ? "connected" : "disconnected",
    ...(dbStatus.error ? { detail: dbStatus.error } : {}),
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use("/api/bookings", submissionLimiter, bookingsRouter);
app.use("/api/contact", submissionLimiter, contactRouter);
app.use("/api/jobs", submissionLimiter, jobsRouter);
app.use("/api/admin", adminRouter);

// 404 handler for unknown API routes
app.use("/api", (_req, res) => {
  return res.status(404).json({ error: "API endpoint not found." });
});

// Safe global error handler (never leaks database credentials or sensitive patient data)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.message === "Origin not allowed by CORS policy") {
    return res.status(403).json({ error: "Origin not allowed by CORS policy." });
  }

  console.error("[API Error]:", err?.code || err?.name || "Error", err?.message || "");

  const isDbConfigError =
    err?.name === "PrismaClientInitializationError" ||
    String(err?.message || "").includes("Environment variable not found: DATABASE_URL") ||
    String(err?.message || "").includes("Can't reach database server");

  if (isDbConfigError) {
    return res.status(503).json({
      error:
        "Database service is not connected yet. Please configure your Supabase PostgreSQL credentials in .env and run Prisma migrations.",
    });
  }

  return res.status(500).json({
    error: "An unexpected server error occurred. Please try again.",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`NOOR AL AFIYA Express API listening on http://localhost:${PORT}`);
  });
}

export default app;
