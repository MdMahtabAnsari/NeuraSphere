import { AnyZodObject} from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError} from "../utils/errors"
import { fromError } from "zod-validation-error";

export const queryValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.query);
        next();
    } catch (error) {

        next(new BadRequestError(fromError(error).message));
    }
}