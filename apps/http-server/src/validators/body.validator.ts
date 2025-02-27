import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { BadRequestError} from "../utils/errors"
import { fromError } from "zod-validation-error";

export const bodyValidator = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {

        next(new BadRequestError(fromError(error).message));
    }
}