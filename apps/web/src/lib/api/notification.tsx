import { api } from "./api";
import { isLoggedIn } from "./auth";

import { z } from "zod";
import { NotificationResponseSchema,NotificationCountResponseSchema,MarkReadNotificationResponseSchema } from "@workspace/schema/api-response/notification";


export const getNotifications = async ({page,limit}:{page:number; limit:number}):Promise<z.infer<typeof NotificationResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/notifications", { params: { page, limit } });
        return response.data as z.infer<typeof NotificationResponseSchema>;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            message: "Error fetching notifications",
            status: "error",
            data: {
                notifications: [],
                totalPage: 0,
                currentPage: 1,
            },
        };
    }
}

export const getNotificationCount = async ():Promise<z.infer<typeof NotificationCountResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/notifications/count");
        return response.data as z.infer<typeof NotificationCountResponseSchema>;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            message: "Error fetching notifications",
            status: "error",
            data: 0
        };
    }
}

export const getUnreadNotificationCount = async ():Promise<z.infer<typeof NotificationCountResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.get("/api/notifications/unread-count");
        return response.data as z.infer<typeof NotificationCountResponseSchema>;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return {
            message: "Error fetching notifications",
            status: "error",
            data: 0
        };
    }
};

export const markNotificationAsRead = async (notificationId: string):Promise<z.infer<typeof MarkReadNotificationResponseSchema>> => {
    try {
        const isLoggedInResponse = await isLoggedIn();
        if (!isLoggedInResponse) {
            throw new Error("User is not logged in");
        }

        const response = await api.post("/api/notifications/mark-read", { notificationId });
        return response.data as z.infer<typeof MarkReadNotificationResponseSchema>;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return {
            message: "Error marking notification as read",
            status: "error",
            data: {
                id: notificationId,
                senderId: "",
                postId: null,
                commentId: null,
                receiverId: "",
                type: "Post",
                content: "",
                isRead: false,
                createdAt: "",
                updatedAt: ""

            }
        };
    }
}
