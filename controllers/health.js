export const healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running 🚀",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
};