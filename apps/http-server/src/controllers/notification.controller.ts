import { CustomRequest } from "../types/customRuquest";
import { Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service";
import { z } from "zod";
import { pageLimitObj,idObj } from "@workspace/schema/notification";

class NotificationController {
    async getNotifications(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { page, limit } = req.query as z.infer<typeof pageLimitObj>;
            const data = await notificationService.getNotifications(
                req.user.id,
                page ? parseInt(page) : 1,
                limit ? parseInt(limit) : 10
            );
            res.status(200).json({
                message: "Notifications fetched successfully",
                status: "success",
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    async getNotificationCount(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data = await notificationService.getNotificationCount(req.user.id);
            res.status(200).json({
                message: "Notification count fetched successfully",
                status: "success",
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    async getUnreadNotificationCount(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data = await notificationService.getUnreadNotificationCount(req.user.id);
            res.status(200).json({
                message: "Unread notification count fetched successfully",
                status: "success",
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
    async markNotificationAsRead(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.body as z.infer<typeof idObj>;
            const data = await notificationService.markAsRead(
                req.user.id,
                id
            );
            res.status(200).json({
                message: "Notification marked as read successfully",
                status: "success",
                data: data,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const notificationController = new NotificationController();