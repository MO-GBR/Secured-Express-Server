import { AppError } from "../utils/ErrorsHandle.js";

export const notFound = (req, res, next) => {
    next(
        new AppError(
            `Route not found: ${req.method} ${req.originalUrl}`,
            404
        )
    );
};