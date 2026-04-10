const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const sequelize = require("./db/config");
const { errorHandler } = require("./utils/errors");

// Import routes
const authRoutes = require("./routes/auth.routes");
const resumeRoutes = require("./routes/resume.routes");
const templateRoutes = require("./routes/templates.routes");
const uploadRoutes = require("./routes/upload.routes");
const pdfRoutes = require("./routes/pdf.routes");
const atsRoutes = require("./routes/ats.routes");
const avatarRoutes = require("./routes/avatar.routes");

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure upload directories exist
const uploadsPath = path.join(__dirname, "uploads");
const avatarsPath = path.join(uploadsPath, "avatars");

if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
if (!fs.existsSync(avatarsPath)) fs.mkdirSync(avatarsPath, { recursive: true });

// Security middleware
app.use(helmet({ contentSecurityPolicy: false }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Static files - Serve uploads directory
app.use("/uploads", express.static(uploadsPath));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/avatar", avatarRoutes);

// Test route
if (process.env.NODE_ENV === "development") {
  app.get("/api/test", (req, res) => {
    res.json({
      success: true,
      message: "API is working!",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Database sync and server start
const startServer = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synced with alter");
    } else {
      await sequelize.sync();
      console.log("✅ Database synced");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  sequelize.close().then(() => process.exit(0));
});

process.on("SIGINT", () => {
  sequelize.close().then(() => process.exit(0));
});

module.exports = app;
