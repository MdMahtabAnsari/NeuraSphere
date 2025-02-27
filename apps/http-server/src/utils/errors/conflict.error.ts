import {AppError} from "./app.error";

export class ConflictError extends AppError {
    constructor(field: string) {
        super(`${field} already exists`, 409);
    }
}

