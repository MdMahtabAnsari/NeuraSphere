import AppError from "./app.error";

class UnauthorisedError extends AppError {
    constructor(message: string|null = null) {
        super(message || 'Unauthorized', 401);

    }
}

export default UnauthorisedError;