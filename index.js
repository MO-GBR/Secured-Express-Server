import "dotenv/config";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { GlobalErrorHandler } from "./middlewares/error-handler.js";
import { logRequestInfo } from "./middlewares/log-info.js";
import { notFound } from "./middlewares/not-found.js";

import healthRoutes from "./routes/health.js";


const app = express();
const PORT = process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Current Request
|--------------------------------------------------------------------------
*/

app.use(logRequestInfo);

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

// Remove Express fingerprint
app.disable("x-powered-by");

// Security headers
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

app.use(limiter);

/*
|--------------------------------------------------------------------------
| Body Parsing
|--------------------------------------------------------------------------
*/

app.use(
    express.json({
        limit: "10kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb",
    })
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.use("/api/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(GlobalErrorHandler);

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const server = app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );
});

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down...`);

    server.close(() => {
        console.log("HTTP server closed.");
        process.exit(0);
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

/*
|--------------------------------------------------------------------------
| Unhandled Errors
|--------------------------------------------------------------------------
*/

process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:", error);

    server.close(() => {
        console.error("UNHANDLED REJECTION:", error);
        process.exit(1);
    });
});

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
    process.exit(1);
});