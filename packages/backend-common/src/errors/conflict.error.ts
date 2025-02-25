import {AppError} from "./app.error.js";

export class ConflictError extends AppError {
    constructor(field: string) {
        super(`${field} already exists`, 409);
    }
}

