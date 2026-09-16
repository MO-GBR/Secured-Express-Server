export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		
	    this.statusCode = statusCode;
	    this.status = statusCode >= 500 ? "error" : "fail";
	    this.isOperational = true;
	    
	    Error.captureStackTrace(this, this.constructor);
	}
};

export const AsyncErrorHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};