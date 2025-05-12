import {z} from "zod";

export const id = z.string({message:"id must be string"}).uuid({message:"id must be a valid uuid"});
export const content = z.string({message:"content must be string"}).min(1, {message:"content must be at least 1 character long"}).max(1000, {message:"content must be at most 1000 characters long"});
export const page = z.string({message:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"page must be number and greater than 0"});
export const limit = z.string({message:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"limit must be number and greater than 0"});
export const comment = z.object({
    postId: id,
    content,
    parentId: id.optional()
});

export const contentObj= z.object({
    content: content
}).strict();
export const commentSuggestion = z.object({
    postId: id,
    parentId: id.optional(),
}).strict();

export const updateComment = z.object({
    id: id,
    content
});

export const idObject = z.object({
    id
});

export const postIdCommentIdObj = z.object({
    postId:id,
    commentId:id.optional(),
});

export const pageLimitObj=z.object({
    page:page.optional(),
    limit:limit.optional(),
});

export const getComments = z.object({
    postId:id,
    commentId:id.optional(),
    page:page.optional(),
    limit:limit.optional(),
});