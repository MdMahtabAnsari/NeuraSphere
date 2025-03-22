import {redisClient} from "./redisClient";

class FollowerRedis{
    private getFollowerCountKey(userId: string) {
        return `follower:${userId}:count`;
    }
    private getFollowingCountKey(userId: string) {
        return `following:${userId}:count`;
    }

    async setFollowerCount(userId: string, count: number) {
        try {
            const key = this.getFollowerCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting follower count in redis', error);
            return false;
        }
    }

    async getFollowerCount(userId: string) {
        try {
            const key = this.getFollowerCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting follower count from redis', error);
            return null;
        }
    }

    async setFollowingCount(userId: string, count: number) {
        try {
            const key = this.getFollowingCountKey(userId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting following count in redis', error);
            return false;
        }
    }

    async incrementFollowerCount(userId: string) {
        try {
            const key = this.getFollowerCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error incrementing follower count in redis', error);
            return false;
        }
    }

    async incrementFollowingCount(userId: string) {
        try {
            const key = this.getFollowingCountKey(userId);
            await redisClient.incr(key);
            return true;
        } catch (error) {
            console.error('Error incrementing following count in redis', error);
            return false;
        }
    }

    async decrementFollowerCount(userId: string) {
        try {
            const key = this.getFollowerCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decrementing follower count in redis', error);
            return false;
        }
    }

    async decrementFollowingCount(userId: string) {
        try {
            const key = this.getFollowingCountKey(userId);
            await redisClient.decr(key);
            return true;
        } catch (error) {
            console.error('Error decrementing following count in redis', error);
            return false;
        }
    }
    async getFollowingCount(userId: string) {
        try {
            const key = this.getFollowingCountKey(userId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting following count from redis', error);
            return null;
        }
    }
}

export const followerRedis = new FollowerRedis();