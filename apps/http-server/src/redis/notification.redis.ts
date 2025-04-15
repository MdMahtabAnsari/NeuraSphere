import { redisClient } from "./redisClient";

class NotificationRedis {
    private getNotificationCountKey(userId: string) {
        return `notification:count:${userId}`;
    }
    private getUnreadNotificationCountKey(userId: string) {
        return `notification:unreadCount:${userId}`;

    }

    async setNotificationCount(userId: string, count: number) {
        try {
            const key = this.getNotificationCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60); // Set expiration to 1 hour
            return true;
        } catch (error) {
            console.error('Error setting notification count in redis', error);
            return false;
        }
    }

    async getNotificationCount(userId: string) {
        try {
            const key = this.getNotificationCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting notification count from redis', error);
            return null;
        }
    }

    async deleteNotificationCount(userId: string) {
        try {
            const key = this.getNotificationCountKey(userId);
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Error deleting notification count from redis', error);
            return false;
        }
    }

    async increaseNotificationCount(userId: string) {
        try {
            const key = this.getNotificationCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error increasing notification count in redis', error);
            return false;
        }
    }

    async decreaseNotificationCount(userId: string) {
        try {
            const key = this.getNotificationCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decreasing notification count in redis', error);
            return false;
        }
    }

    async setUnreadNotificationCount(userId: string, count: number) {
        try {
            const key = this.getUnreadNotificationCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60); // Set expiration to 1 hour
            return true;
        } catch (error) {
            console.error('Error setting unread notification count in redis', error);
            return false;
        }
    }

    async getUnreadNotificationCount(userId: string) {
        try {
            const key = this.getUnreadNotificationCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting unread notification count from redis', error);
            return null;
        }
    }
    async deleteUnreadNotificationCount(userId: string) {
        try {
            const key = this.getUnreadNotificationCountKey(userId);
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Error deleting unread notification count from redis', error);
            return false;
        }
    }
    async increaseUnreadNotificationCount(userId: string) {
        try {
            const key = this.getUnreadNotificationCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error increasing unread notification count in redis', error);
            return false;
        }
    }
    async decreaseUnreadNotificationCount(userId: string) {
        try {
            const key = this.getUnreadNotificationCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decreasing unread notification count in redis', error);
            return false;
        }
    }

}

export const notificationRedis = new NotificationRedis();