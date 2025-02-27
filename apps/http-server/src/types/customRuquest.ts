// src/types/express.d.ts
import { Request } from "express";
import {jwt} from "@workspace/schema/jwt";
import {z} from "zod";


export interface CustomRequest extends Request {
    user: z.infer<typeof jwt>;
}