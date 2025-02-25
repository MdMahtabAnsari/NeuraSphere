import {z} from 'zod';

export const signup = z.object({
    // username must be a string, and it must be at least 3 characters long and at most 20 characters long and must have only alphanumeric characters
    username: z.string({message:"username must be string"}).min(3,{message:"username must have at least 3 characters"}).max(20,{message:"username must have at most 20 characters"}).regex(/^[a-zA-Z0-9]*$/,{message:"username must have only alphanumeric characters"}),
    // password must be a string, and it must be at least 8 characters long and at most 20 characters long must have at least one uppercase letter, one lowercase letter, one number, and one special character
    password: z.string({message:"password must be string"}).min(8,{message:"password must have at least 3 characters"}).max(20,{message:"password must have at most 20 characters"}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, {message:"password must have at least one uppercase letter, one lowercase letter, one number, and one special character"}),
    // email must be a string, and it must be a valid email
    email: z.string({message:"email must be string"}).email({message:"email must be a valid email"}),
    // dateOfBirth must be a string, and it must be a valid date
    dob: z.coerce.date({message:"dateOfBirth must be a valid date"}),
    // image must be a string, and it must be a valid URL
    image: z.string({message:"image must be string"}).url({message:"image must be a valid URL"}).optional(),
    // mobile must be a string, and it must be a valid phone number
    mobile: z.string({message:"mobile must be string"}).regex(/^\d{10}$/, {message:"mobile must be a valid phone number"}).optional(),
    // bio must be a string, and it must be at most 100 characters long
    bio: z.string({message:"bio must be string"}).max(100,"bio must be at most 100 characters long").optional(),
    // name must be a string, and it must be at most 50 characters long
    name: z.string({message:"name must be string"}).max(50,{message:"name must be at most 50 characters long"}),
}).strict({message: 'Invalid data'});

export type TSignup = z.infer<typeof signup>