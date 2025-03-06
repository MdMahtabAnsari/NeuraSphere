import {redisClient} from "./redisClient";

class CommentReactionRedis {
    private getLikeKey(postId: string, commentId: string) {
        return `comment:${postId}:${commentId}:like`;
    }
    private getDislikeKey(postId: string, commentId: string) {
        return `comment:${postId}:${commentId}:dislike`;
    }
    private getReactionStatusKey(postId: string, commentId: string, userId: string) {
        return `comment:${postId}:${commentId}:user:${userId}:reaction`;
    }
    private getPostUniversalKey(postId: string) {
        return `comment:${postId}:*`;
    }
    private getCommentUniversalKey(postId: string, commentId: string) {
        return `comment:${postId}:${commentId}:*`;
    }
    async setLike(postId: string, commentId: string, count: number) {
        try {
            const key = this.getLikeKey(postId, commentId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting comment like count in redis', error);
            return false;
        }
    }

    async getLike(postId: string, commentId: string) {
        try {
            const key = this.getLikeKey(postId, commentId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting comment like count from redis', error);
            return null;
        }
    }

    async setDislike(postId: string, commentId: string, count: number) {
        try {
            const key = this.getDislikeKey(postId, commentId);
            await redisClient.set(key, count);
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting comment dislike count in redis', error);
            return false;
        }
    }

    async getDislike(postId: string, commentId: string) {
        try {
            const key = this.getDislikeKey(postId, commentId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        } catch (error) {
            console.error('Error getting comment dislike count from redis', error);
            return null;
        }
    }

    async setUserReactionStatus(postId: string, commentId: string, userId: string, reaction: { like: boolean, dislike: boolean }) {
        try {
            const key = this.getReactionStatusKey(postId, commentId, userId);
            await redisClient.set(key, JSON.stringify(reaction));
            await redisClient.expire(key, 60 * 60);
            return true;
        } catch (error) {
            console.error('Error setting user reaction status in redis', error);
            return false;
        }
    }

    async getUserReactionStatus(postId: string, commentId: string, userId: string) {
        try {
            const key = this.getReactionStatusKey(postId, commentId, userId);
           const reaction = await redisClient.get(key);
           return reaction ? JSON.parse(reaction) : null;
        } catch (error) {
            console.error('Error getting user reaction status from redis', error);
            return null;
        }
    }

    async decreaseLikeCount(postId: string, commentId: string) {
        try {
            const key = this.getLikeKey(postId, commentId);
            return await redisClient.decr(key);

        } catch (error) {
            console.error('Error decreasing comment like count in redis', error);
            return null;
        }
    }

    async decreaseDislikeCount(postId: string, commentId: string) {
        try {
            const key = this.getDislikeKey(postId, commentId);
            return await redisClient.decr(key);
        } catch (error) {
            console.error('Error decreasing comment dislike count in redis', error);
            return null;
        }
    }
    async deleteUserCommentReactionStatus(postId: string, commentId: string, userId: string) {
        try {
            const key = this.getReactionStatusKey(postId, commentId, userId);
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Error deleting user reaction status from redis', error);
            return false;
        }
    }

    async deleteLike(postId: string, commentId: string) {
        try {
            const key = this.getLikeKey(postId, commentId);
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Error deleting comment like count from redis', error);
            return false;
        }
    }

    async deleteDislike(postId: string, commentId: string) {
        try {
            const key = this.getDislikeKey(postId, commentId);
            await redisClient.del(key);
            return true;
        } catch (error) {
            console.error('Error deleting comment dislike count from redis', error);
            return false;
        }
    }

    async removeCacheOfComment(postId: string, commentId: string) {
        try {
            const keys = await redisClient.keys(this.getCommentUniversalKey(postId, commentId));
            await redisClient.del(...keys);
            return true;
        } catch (error) {
            console.error('Error deleting comment reaction from redis', error);
            return false;
        }
    }

    async removeCacheByPostId(postId: string) {
        try {
            const keys = await redisClient.keys(this.getPostUniversalKey(postId));
            await redisClient.del(...keys);
            return true;
        } catch (error) {
            console.error('Error deleting comment reaction from redis', error);
            return false;
        }
    }

    async increaseLikeCount(postId: string, commentId: string) {
        try {
            const key = this.getLikeKey(postId, commentId);
            return await redisClient.incr(key);
        } catch (error) {
            console.error('Error increasing comment like count in redis', error);
            return null;
        }
    }

    async increaseDislikeCount(postId: string, commentId: string) {
        try {
            const key = this.getDislikeKey(postId, commentId);
            return await redisClient.incr(key);
        } catch (error) {
            console.error('Error increasing comment dislike count in redis', error);
            return null;
        }
    }
}

export const commentReactionRedis = new CommentReactionRedis();

