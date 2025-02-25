import AppError from "./app.error.js";

class ConflictError extends AppError {
    constructor(field: string) {
        super(`${field} already exists`, 409);
    }
}

export default ConflictError;