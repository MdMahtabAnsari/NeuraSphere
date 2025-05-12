import { z } from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    image: z.string().url().optional(),
});
const ReactionsSchema = z.object({
    likeCount: z.number(),
    dislikeCount: z.number(),
});

const ReactionStatusSchema = z.object({
    like: z.boolean(),
    dislike: z.boolean(),
});
export const CommentSchema = z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    parentId: z.string().uuid().nullable(),
    content: z.string(),
    userId: z.string().uuid(),
    user: UserSchema,
    isEdited: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    reactions: ReactionsSchema,
    reactionStatus: ReactionStatusSchema,
    replyCount: z.number(),
    isUserComment: z.boolean(),
});
const CommentUpdateResponseSchema = z.object({
  message: z.literal("Comment updated successfully"),
  status: z.literal("success"),
  data: z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    parentId: z.string().uuid().nullable(), // null or UUID
    content: z.string(),
    userId: z.string().uuid(),
    user: UserSchema,
    isEdited: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

export const CreateCommentDataSchema = z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    parentId: z.string().uuid().nullable(), // null or UUID
    content: z.string(),
    userId: z.string().uuid(),
    user: UserSchema,
    isEdited: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CommentDataSchema = z.object({
    comments: z.array(CommentSchema),
    totalPage: z.number(),
    currentPage: z.number(),
});

export const CommentResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: CommentDataSchema,
});


export const CreateCommentResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: CreateCommentDataSchema,
});

export const CommentSuggestionResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: z.object({
    content: z.string(),
  }),
})

export const DeleteCommentResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
});
