import { z } from "zod";


export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().url().optional(),
});



export const FollowerSuggestionsDataSchema = z.object({
  suggestions: z.array(UserSchema),
  totalPage: z.number(),
  currentPage: z.number(),
});


export const FollowerSuggestionsResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: FollowerSuggestionsDataSchema,
});

export const FollowRelationSchema = z.object({
  id: z.string().uuid(),
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
  createdAt: z.string().datetime(), // Valid ISO timestamp
  updatedAt: z.string().datetime(),
});
export const FollowRelationResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: FollowRelationSchema,
});


export const FollowerSchema = z.object({
  follower: UserSchema
});

export const FollowerDataSchema = z.object({
  followers: z.array(FollowerSchema),
  totalPage: z.number(),
  currentPage: z.number(),
});

export const FollowersResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: FollowerDataSchema,
});


export const FollowingSchema = z.object({
  following: UserSchema
});

export const FollowingDataSchema = z.object({
  following: z.array(FollowingSchema),
  totalPage: z.number(),
  currentPage: z.number(),
});

export const FollowingsResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: FollowingDataSchema,
});


export const MutualFollowerDataSchema = z.object({
  mutual: z.array(UserSchema),
  totalPage: z.number(),
  currentPage: z.number(),
});
export const MutualFollowerResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: MutualFollowerDataSchema,
});
