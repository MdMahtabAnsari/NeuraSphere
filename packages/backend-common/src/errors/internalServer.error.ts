import AppError from "./app.error";

class InternalServerError extends AppError {
    constructor(message: string|null = null) {
        super(message || 'Internal server error', 500);
    }
}

export default InternalServerError;