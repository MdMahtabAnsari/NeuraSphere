import AppError from "./app.error.js";

class BadRequestError extends AppError {
    constructor(message: string[]|string) {
        const errorMessage = `invalid fields: ${Array.isArray(message) ? message.join(', ') : message}`;
        super(errorMessage, 400);
    }
}

export default BadRequestError;