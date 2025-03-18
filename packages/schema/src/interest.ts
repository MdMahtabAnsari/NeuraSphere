import {z} from 'zod';

export const interest =  z.array(z.string({message:"intrest must be string"}).trim().max(50,{message:"intrest must be at most 50 characters long"}));
export const page = z.string({message:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"page must be number and greater than 0"});
export const limit = z.string({message:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"limit must be number and greater than 0"});


export const pageLimitObj = z.object({
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()

export const interestObj = z.object({
    // tags must be array of strings, and each string must be at most 50 characters long
    interest: interest
}).strip()