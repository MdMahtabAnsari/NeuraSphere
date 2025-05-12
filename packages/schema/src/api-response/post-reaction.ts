import {z} from "zod";

export const ReactionResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: z.number()
});


export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  image: z.string().url().optional()
});

export const LikeAndDislikeUserSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  type: z.union([z.literal("like"), z.literal("dislike")]),
  user: UserSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const LikeAndDislikeDataSchema = z.object({
  users: z.array(LikeAndDislikeUserSchema),
  totalPage: z.number().int(),
  currentPage: z.number().int()
});

export const LikeAndDislikeResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: LikeAndDislikeDataSchema
});
