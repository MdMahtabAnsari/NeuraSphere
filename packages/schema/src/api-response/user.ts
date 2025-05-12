import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string(),
  dob: z.string().datetime(),
  image: z.string().url().optional(),
  bio: z.string().optional(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UserDataSchema = z.object({
  users: z.array(UserSchema),
  totalPage: z.number(),
  currentPage: z.number(),
});

export const UsersResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: UserDataSchema,
});

export const UserResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: UserSchema,
});


export const ProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string().nullable(),
  dob: z.string().datetime(),
  image: z.string().url().nullable(),
  bio: z.string(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const FriendStatusSchema = z
  .object({
    accepted: z.boolean(),
    senderBlocked: z.boolean(),
    receiverBlocked: z.boolean(),
    senderPending: z.boolean(),
    receiverPending: z.boolean(),
    rejected: z.boolean(),
  })
  .optional();

// Data schema (with optional `isFollowing` and `isFriend`)
export const ProfileDataSchema = z.object({
  profile: ProfileSchema,
  isFollowing: z.boolean().optional(),
  friendStatus: FriendStatusSchema,
  followersCount: z.number(),
  followingCount: z.number(),
  friendsCount: z.number(),
  postCount: z.number(),
  isUserProfile: z.boolean(),
});

// Final response schema
export const UserProfileResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
  data: ProfileDataSchema,
});