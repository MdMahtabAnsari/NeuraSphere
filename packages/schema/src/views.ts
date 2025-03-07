import {z} from "zod";

export const id = z.string({message:"id must be string"}).uuid({message:"id must be a valid uuid"});



export const postIdObj = z.object({
    // postId must be a string, and it must be a valid uuid
    postId: id
}).strip()