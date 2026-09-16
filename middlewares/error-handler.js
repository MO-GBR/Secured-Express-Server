import { logError } from "../utils/CentralLogger.js";
import { AppError } from "../utils/ErrorsHandle.js";

export const GlobalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    logError("Request error", {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        user: req.user?.id,
    });

    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    };
    
    // Production
    if (!err.isOperational) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
    
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(el => el.message);
        err = new AppError(messages.join(", "), 400);
    }
    
    if (err.name === "CastError") {
        err = new AppError("Invalid ID format", 400);
    }
    
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err = new AppError(`Duplicate value for ${field}`, 400);
    }
      
    if (err.name === "JsonWebTokenError") {
        err = new AppError("Invalid token", 401);
    }
      
    if (err.name === "TokenExpiredError") {
        err = new AppError("Token expired", 401);
    }

    res.status(err.statusCode || 500).json({
        status: err.status || "error",
        message: err.message || "Internal Server Error",
        stack: err.stack,
        statusCode: err.statusCode || 500
    });
};