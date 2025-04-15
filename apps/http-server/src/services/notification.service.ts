import { AppError, InternalServerError, BadRequestError, UnauthorisedError,NotFoundError } from "../utils/errors";
import { notificationRepository } from "../repositories/noification.repository";
import { z } from "zod";
import { createNotification } from "@workspace/schema/notification";
import { createContent } from "../utils/helpers/notification.helper";
import { userRepository } from "../repositories/user.repository";
import { notificationRedis } from '../redis/notification.redis';

export type NotificationWithoutContent = Omit<z.infer<typeof createNotification>, "content">

class NotificationService {
    async getNotifications(userId: string, page: number = 1, limit: number = 10) {
        try {
            const notifications = await notificationRepository.getNotifications(
                userId,
                page,
                limit
            );
            const totalPage = await notificationRepository.getNotificationsPage(
                userId,
                limit
            );
            return { notifications, totalPage, currentPage: page };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getting notifications", error);
            throw new InternalServerError();
        }
    }
    async getNotificationCount(userId: string) {
        try {
            const cachedCount = await notificationRedis.getNotificationCount(userId);
            if(!cachedCount) {
                const count = await notificationRepository.notificationCount(userId);
                await notificationRedis.setNotificationCount(userId, count);
                return count;
            }
            return cachedCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getting notification count", error);
            throw new InternalServerError();
        }
    }

    async getUnreadNotificationCount(userId: string) {
        try {
            const cachedCount = await notificationRedis.getUnreadNotificationCount(userId);
            if(!cachedCount) {
                const count = await notificationRepository.getUnreadNotificationCount(userId);
                await notificationRedis.setUnreadNotificationCount(userId, count);
                return count;
            }
            return cachedCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getting unread notification count", error);
            throw new InternalServerError();
        }
    }

    async createNotification(data: NotificationWithoutContent) {
        try {
            const sender = await userRepository.getUserById(data.senderId);
            if(!sender) {
                throw new NotFoundError("Sender");
            }
            const content = createContent(data.type, sender.username,data.commentId!== undefined);
        const notification = await notificationRepository.createNotification({
                ...data,
                content,
            });
            if(notification){
                const cachedUnreadCount = await notificationRedis.getUnreadNotificationCount(data.receiverId);
                if(cachedUnreadCount) {
                    await notificationRedis.increaseUnreadNotificationCount(data.receiverId);
                } else {
                    const count = await notificationRepository.getUnreadNotificationCount(data.receiverId);
                    await notificationRedis.setUnreadNotificationCount(data.receiverId, count);
                }
                const cachedCount = await notificationRedis.getNotificationCount(data.receiverId);
                if(cachedCount) {
                    await notificationRedis.increaseNotificationCount(data.receiverId);
                }
                else {
                    const count = await notificationRepository.notificationCount(data.receiverId);
                    await notificationRedis.setNotificationCount(data.receiverId, count);
                }
            }
            return notification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in creating notification", error);
            throw new InternalServerError();
        }
    }
    async markAsRead(userId: string, notificationId: string) {
        try {
            const notification =
                await notificationRepository.getNotificationById(notificationId);
            if (!notification) {
                throw new BadRequestError("Notification not found");
            }
            if (notification.receiverId !== userId) {
                throw new UnauthorisedError(
                    "You are not authorized to mark this notification as read"
                );
            }
            const readNotification = await notificationRepository.markNotificationAsRead(
                notificationId
            );
            if(readNotification) {
                const cachedUnreadCount = await notificationRedis.getUnreadNotificationCount(userId);
                if(cachedUnreadCount) {
                    await notificationRedis.decreaseUnreadNotificationCount(userId);
                } else {
                    const count = await notificationRepository.getUnreadNotificationCount(userId);
                    await notificationRedis.setUnreadNotificationCount(userId, count);
                }
            }
            return readNotification;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in marking notification as read", error);
            throw new InternalServerError();
        }
    }
}

export const notificationService = new NotificationService();
