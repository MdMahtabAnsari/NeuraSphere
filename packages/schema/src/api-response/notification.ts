import { z } from "zod";

export const NotificationTypeEnum = z.enum([
    "Post",
    "Reply",
    "Comment",
    "Like",
    "Dislike",
    "Follow",
    "Unfollow",
    "Request",
    "Accept",
]);
export const NotificationSchema = z.object({
    id: z.string().uuid(),
    senderId: z.string().uuid(),
    postId: z.string().uuid().nullable(),
    commentId: z.string().uuid().nullable(),
    receiverId: z.string().uuid(),
    type: NotificationTypeEnum,
    content: z.string(),
    isRead: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const NotificationDataSchema = z.object({
    notifications: z.array(NotificationSchema),
    totalPage: z.number(),
    currentPage: z.number(),
});

export const NotificationResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: NotificationDataSchema,
});

export const NotificationCountResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: z.number()
})


export const MarkReadNotificationResponseSchema = z.object({
    message: z.string(),
    status: z.union([z.literal("success"), z.literal("fail"), z.literal("error")]),
    data: NotificationSchema
});