import {z} from 'zod';

export const otpEmailRequest = z.object({
    email: z.string({message:"email must be string"}).trim().email({message:"email must be a valid email"}),
}).strict();

export const otpEmailVerify = z.object({
    email: z.string({message:"email must be string"}).trim().email({message:"email must be a valid email"}),
    otp:z.string({message:"otp must be string"}).length(6,{message:"otp must be 6 characters long"}).regex(/^\d{6}$/, {message:"otp must be a valid OTP"})
}).strict();