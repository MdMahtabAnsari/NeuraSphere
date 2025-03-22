import {redisClient} from "./redisClient";

class FriendRedis {
    private getFriendCountKey(userId: string) {
        return `friends:${userId}:friend:count`;
    }
    private getFriendRequestCountKey(userId: string) {
        return `friends:${userId}:request:count`;
    }

    private getBlockedCountKey(userId: string) {
        return `friends:${userId}:blocked:count`;
    }

    async setFriendCount(userId: string, count: number) {
        try {
            const key = this.getFriendCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting friend count in redis', error);
            return false;
        }
    }

    async getFriendCount(userId: string) {
        try {
            const key = this.getFriendCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting friend count from redis', error);
            return null;
        }
    }

    async setFriendRequestCount(userId: string, count: number) {
        try {
            const key = this.getFriendRequestCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting friend request count in redis', error);
            return false;
        }
    }

    async getFriendRequestCount(userId: string) {
        try {
            const key = this.getFriendRequestCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting friend request count from redis', error);
            return null;
        }
    }

    async setBlockedCount(userId: string, count: number) {
        try {
            const key = this.getBlockedCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting blocked count in redis', error);
            return false;
        }
    }

    async getBlockedCount(userId: string) {
        try {
            const key = this.getBlockedCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting blocked count from redis', error);
            return null;
        }
    }

    async incrementFriendCount(userId: string) {
        try {
            const key = this.getFriendCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error incrementing friend count in redis', error);
            return false;
        }
    }

    async incrementFriendRequestCount(userId: string) {
        try {
            const key = this.getFriendRequestCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error incrementing friend request count in redis', error);
            return false;
        }
    }

    async incrementBlockedCount(userId: string) {
        try {
            const key = this.getBlockedCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error incrementing blocked count in redis', error);
            return false;
        }
    }

    async decrementFriendCount(userId: string) {
        try {
            const key = this.getFriendCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decrementing friend count in redis', error);
            return false;
        }
    }

    async decrementFriendRequestCount(userId: string) {
        try {
            const key = this.getFriendRequestCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decrementing friend request count in redis', error);
            return false;
        }
    }

    async decrementBlockedCount(userId: string) {
        try {
            const key = this.getBlockedCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decrementing blocked count in redis', error);
            return false;
        }
    }
}

export const friendRedis = new FriendRedis();