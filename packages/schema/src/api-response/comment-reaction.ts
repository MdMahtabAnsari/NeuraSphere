import { z } from "zod";

export const ReactionResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: z.number()
});


export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string().url().optional(),
});

export const LikedAndDislikedUserSchema = z.object({
    id: z.string().uuid(),
    commentId: z.string().uuid(),
    user: UserSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const LikedAndDislikedUserDataSchema = z.object({
    users: z.array(LikedAndDislikedUserSchema),
    totalPage: z.number().int().positive(),
    currentPage: z.number().int().positive(),
});

export const LikedAndDislikedUsersResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: LikedAndDislikedUserDataSchema,
});


