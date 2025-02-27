import {z} from 'zod';


export const jwt = z.object({
    // id must be a string, and it must be a valid UUID
    id: z.string({message:"userID must be string"}).uuid({message:"userID must be a valid UUID"}),
    // username must be a string, and it must be at least 3 characters long and at most 20 characters long and must have only alphanumeric characters
    username: z.string({message:"username must be string"}).trim().min(3,{message:"username must have at least 3 characters"}).max(20,{message:"username must have at most 20 characters"}).regex(/^[a-zA-Z0-9]*$/,{message:"username must have only alphanumeric characters"}),
    // email must be a string, and it must be a valid email
    email: z.string({message:"email must be string"}).trim().email({message:"email must be a valid email"}),
    // mobile must be a string, and it must be a valid phone number
    // is verified must be a boolean
    isVerified: z.boolean({message:"isVerified must be boolean"}),
    // iat must be a number
    iat: z.number({message:"iat must be number"}).optional(),
    // exp must be a number
    exp: z.number({message:"exp must be number"}).optional(),
}).strict();