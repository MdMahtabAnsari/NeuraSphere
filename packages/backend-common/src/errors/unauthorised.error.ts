import {AppError} from "./app.error";

export class UnauthorisedError extends AppError {
    constructor(message: string|null = null) {
        super(message || 'Unauthorized', 401);

    }
}

