import {z} from "zod";

export const id = z.string({message:"id must be string"}).uuid({message:"id must be a valid uuid"});
export const page = z.string({message:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"page must be number and greater than 0"});
export const limit = z.string({message:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"limit must be number and greater than 0"});

export const idObj=z.object({
    id:id
}).strip()

export const followerIdObj=z.object({
    followerId:id
}).strip()

export const followingIdObj=z.object({
    followingId:id
}).strip()

export const pageLimitObj = z.object({
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()