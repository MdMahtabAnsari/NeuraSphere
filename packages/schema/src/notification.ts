import {z} from 'zod';

export const id = z.string({message:"id must be string"}).uuid({message:"id must be a valid uuid"});
export const page = z.string({message:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"page must be number and greater than 0"});
export const limit = z.string({message:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"limit must be number and greater than 0"});
export const type = z.enum(["Post","Reply","Comment","Like","Dislike","Follow","Unfollow","Request","Accept"],{message:"type must be one of Post, Reply, Comment, Like, Dislike, Follow, Unfollow, Request, Accept"});


export const createNotification = z.object({
    senderId: id,
    receiverId: id,
    postId: id.optional(),
    commentId: id.optional(),
    type: type,
    content: z.string({message:"content must be string"}).trim().max(100,{message:"content must be at most 100 characters long"}),
}).strip()

export const pageLimitObj = z.object({
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()

export const idObj=z.object({
    id:id
}).strip();
