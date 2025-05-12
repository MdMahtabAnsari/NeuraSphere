import { z } from "zod";

export const MediaSchema = z.object({
    id: z.string(),
    type: z.union([z.literal("image"), z.literal("video")]),
    url: z.string().url(),
});

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    name: z.string(),
    image: z.string().url().optional(),
});

export const TagSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const TagWrapperSchema = z.object({
    tag: TagSchema,
});

export const ReactionsSchema = z.object({
    likeCount: z.number(),
    dislikeCount: z.number(),
});

export const ReactionStatusSchema = z.object({
    like: z.boolean(),
    dislike: z.boolean(),
});

export const PostSchema = z.object({
    id: z.string(),
    content: z.string(),
    media: z.array(MediaSchema),
    user: UserSchema,
    tags: z.array(TagWrapperSchema),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    isEdited: z.boolean(),
    reactions: ReactionsSchema,
    reactionStatus: ReactionStatusSchema,
    comments: z.number(),
    views: z.number(),
    isUserPost: z.boolean(),
});


export const PostDataSchema = z.object({
    posts: z.array(PostSchema),
    totalPage: z.number(),
    currentPage: z.number(),
});

export const PostResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: PostDataSchema,
});

export const DeletePostResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
});

export const PostByIdResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: PostSchema,
});


export const ViewPostResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: z.number(),
});