import { z } from "zod";

export const FriendStatusEnum = z.enum([
    "Pending",
    "Accepted",
    "Rejected",
    "Blocked",
]);

export const FriendStatusDataSchema = z.object({
    id: z.string().uuid(),
    senderId: z.string().uuid(),
    receiverId: z.string().uuid(),
    image: z.string().url().optional(),
    status: FriendStatusEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const FriendStatusResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: FriendStatusDataSchema,
});


export const UserSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    name: z.string(),
    image: z.string().url().nullable(), // can be null or a valid URL
});

const RequestSchema = z.object({
    sender: UserSchema,
});

export const FriendRequestDataSchema = z.object({
    requests: z.array(RequestSchema),
    totalPages: z.number(),
    currentPage: z.number(),
});

export const FriendRequestsResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: FriendRequestDataSchema,
});



export const SuggestionsDataSchema = z.object({
    suggestions: z.array(UserSchema),
    totalPages: z.number(),
    currentPage: z.number(),
});

export const FriendSuggestionsResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: SuggestionsDataSchema,
});


export const BlockedFriendSchema = z.object({
  receiver: UserSchema,
});

export const BlockedFriendsDataSchema = z.object({
  blocked: z.array(BlockedFriendSchema),
  totalPages: z.number(),
  currentPage: z.number(),
});

export const BlockedFriendsResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("error")]),
  data: BlockedFriendsDataSchema,
});


export const FriendsDataSchema = z.object({
  friends: z.array(UserSchema),
  totalPages: z.number(),
  currentPage: z.number(),
});

export const FriendsResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("error")]),
  data: FriendsDataSchema,
});

export const MutualFriendsDataSchema = z.object({
  mutual: z.array(UserSchema),
  totalPages: z.number(),
  currentPage: z.number(),
});

export const MutualFriendsResponseSchema = z.object({
  message: z.string(),
  status: z.union([z.literal("success"), z.literal("error")]),
  data: MutualFriendsDataSchema,
});


