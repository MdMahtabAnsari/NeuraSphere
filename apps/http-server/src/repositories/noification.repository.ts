import { InternalServerError, NotFoundError, ConflictError } from '../utils/errors/index'
import { client, Prisma } from '@workspace/database/client'
import {createNotification} from '@workspace/schema/notification'
import {z} from 'zod'

class NotificationRepository{
    async getNotifications(userId: string, page: number = 1, limit: number = 10) {
        try {
            return await client.notification.findMany({
                where: {
                    receiverId: userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            })
        } catch (error) {
            console.error("Error getting notifications Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
            }
            throw new InternalServerError()
        }
    }

    async getNotificationsPage(userId: string,limit: number = 10) {
        try {
            const count = await client.notification.count({
                where: {
                    receiverId: userId,
                },
            })
            return Math.ceil(count / limit)
        }
        catch (error) {
            console.error("Error getting notifications page Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
            }
            throw new InternalServerError()
        }
    }

    async notificationCount(userId: string) {
        try {
            return await client.notification.count({
                where: {
                    receiverId: userId,
                },
            })
        } catch (error) {
            console.error("Error getting notification count Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
            }
            throw new InternalServerError()
        }
    }

    async getUnreadNotificationCount(userId: string) {
        try {
            return await client.notification.count({
                where: {
                    receiverId: userId,
                    isRead: false,
                },
            })
        }
        catch (error) {
            console.error("Error getting unread notification count Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("User")
                }
            }
            throw new InternalServerError()
        }
    }

    async createNotification(notification: z.infer<typeof createNotification>) {
        try {
            return await client.notification.create({
                data: notification,
            })
        } catch (error) {
            console.error("Error creating notification Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictError("Notification already exists")
                }
            }
            throw new InternalServerError()
        }
    }

    async markNotificationAsRead(notificationId: string) {
        try {
            return await client.notification.update({
                where: {
                    id: notificationId,
                },
                data: {
                    isRead: true,
                },
            })
        } catch (error) {
            console.error("Error marking notification as read Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("Notification")
                }
            }
            throw new InternalServerError()
        }
    }

    async getNotificationById(notificationId: string) {
        try {
            return await client.notification.findUnique({
                where: {
                    id: notificationId,
                },
            })
        } catch (error) {
            console.error("Error getting notification by id Repository", error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new NotFoundError("Notification")
                }
            }
            throw new InternalServerError()
        }
    }
}

export const notificationRepository = new NotificationRepository();