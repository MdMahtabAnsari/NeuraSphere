
export class AppError extends Error {
    readonly status: string;
    readonly isOperational: boolean;
    readonly message: string;
    readonly statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
    }
  }