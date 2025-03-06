import {redisClient} from "./redisClient"

interface ReactionStatus {
    like:boolean;
    dislike:boolean;
}

class PostReactionRedis {

    private getLikeKey(postId: string) {
        return `post:${postId}:like`;
    }
    private getDislikeKey(postId: string) {
        return `post:${postId}:dislike`;
    }
    private getReactionStatusKey(postId: string,userId:string) {
        return `post:${postId}:user:${userId}:reaction`;
    }
    private getUniversalKey(postId: string) {
        return `post:${postId}:*`;
    }
    async setLike(postId:string,count:number) {
        try{
            const key = this.getLikeKey(postId);
            await redisClient.set(key,count);
            await redisClient.expire(key,60*60);
            return true;
        }catch(error){
            console.error('Error setting post like count in redis',error);
            return false;
        }
    }

    async getLike(postId:string) {
        try{
            const key = this.getLikeKey(postId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        }catch(error){
            console.error('Error getting post like count from redis',error);
            return null;
        }
    }

    async setDislike(postId:string,count:number) {
        try{
            const key = this.getDislikeKey(postId);
            await redisClient.set(key,count);
            await redisClient.expire(key,60*60);
            return true;
        }catch(error){
            console.error('Error setting post dislike count in redis',error);
            return false;
        }
    }

    async getDislike(postId:string) {
        try{
            const key = this.getDislikeKey(postId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        }catch(error){
            console.error('Error getting post dislike count from redis',error);
            return null;
        }
    }

    async incrementsLike(postId:string) {
        try{
            const key = this.getLikeKey(postId);
            return await redisClient.incr(key)
        }catch(error){
            console.error('Error incrementing post like count in redis',error);
            return null;
        }
    }
    async incrementsDislike(postId:string) {
        try{
            const key = this.getDislikeKey(postId);
            return await redisClient.incr(key);
        }catch(error){
            console.error('Error incrementing post dislike count in redis',error);
            return null;
        }
    }

    async decrementsLike(postId:string) {
        try{
            const key = this.getLikeKey(postId);
            return await redisClient.decr(key);
        }catch(error){
            console.error('Error decrementing post like count in redis',error);
            return null;
        }
    }
    async decrementsDislike(postId:string) {
        try{
            const key = this.getDislikeKey(postId);
            return await redisClient.decr(key);
        }catch(error){
            console.error('Error decrementing post dislike count in redis',error);
            return null;
        }
    }

    async setUserReactionStatus(postId:string,userId:string,reaction:ReactionStatus) {
        try{
            const key = this.getReactionStatusKey(postId,userId);
            await redisClient.set(key,JSON.stringify(reaction));
            await redisClient.expire(key,60*60);
            return true;
        }catch(error){
            console.error('Error setting user reaction status in redis',error);
            return false;
        }
    }
    async getUserReactionStatus(postId:string,userId:string) {
        try{
            const key = this.getReactionStatusKey(postId,userId);
            const reaction = await redisClient.get(key);
            return reaction ? JSON.parse(reaction)  : null
        }catch(error){
            console.error('Error getting user reaction status from redis',error);
            return null;
        }
    }
    async deleteUserReactionStatus(postId:string,userId:string) {
        try{
            const key = this.getReactionStatusKey(postId,userId);
            await redisClient.del(key);
            return true;
        }catch(error){
            console.error('Error deleting user reaction status from redis',error);
            return false;
        }
    }

    async deleteLike(postId:string) {
        try{
            const key = this.getLikeKey(postId);
            await redisClient.del(key);
            return true;
        }catch(error){
            console.error('Error deleting post like count from redis',error);
            return false;
        }
    }
    async deleteDislike(postId:string) {
        try{
            const key = this.getDislikeKey(postId);
            await redisClient.del(key);
            return true;
        }catch(error){
            console.error('Error deleting post dislike count from redis',error);
            return false;
        }
    }

    async deletePostReaction(postId:string) {
        try{
            const likeKey = this.getLikeKey(postId);
            const dislikeKey = this.getDislikeKey(postId);
            await redisClient.del(likeKey,dislikeKey);
            return true;
        }catch(error){
            console.error('Error deleting post reaction from redis',error);
            return false;
        }
    }

    async removeCacheByPostId(postId:string) {
        try{
            const keys = await redisClient.keys(this.getUniversalKey(postId));
            await redisClient.del(...keys);
            return true;
        }catch(error){
            console.error('Error deleting post reaction from redis',error);
            return false;
        }
    }
}

export const postReactionRedis = new PostReactionRedis();