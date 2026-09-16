import { logInfo } from '../utils/CentralLogger.js'

export const logRequestInfo = (req, res, next) => {
    const { method, originalUrl, statusCode } = req;
    const timestamp = new Date().toISOString();

    console.log(`⚡[${timestamp}]: ${method} ${originalUrl} - Status: ${statusCode} 👍`);

    res.on('finish', () => {
        logInfo("Request Completed", {
            method,
            originalUrl,
            statusCode,
            timestamp
        });
    });

    next();
};