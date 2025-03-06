import {redisClient} from "./redisClient"

class CommentRedis{
    private getCommentKey(postId:string){
        return `comment:${postId}:count`;
    }
    async setCommentCount(postId:string,count:number){
        try{
            const key = this.getCommentKey(postId);
            await redisClient.set(key,count);
            await redisClient.expire(key,60*60);
            return true;
        }catch(error){
            console.error('Error setting comment count in redis',error);
            return false;
        }
    }

    async getCommentCount(postId:string){
        try{
            const key = this.getCommentKey(postId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        }catch(error){
            console.error('Error getting comment count from redis',error);
            return null;
        }
    }

    async incrementCommentCount(postId:string){
        try{
            const key = this.getCommentKey(postId);
            return await redisClient.incr(key)
        }catch(error){
            console.error('Error incrementing comment count in redis',error);
            return null;
        }
    }
    async decrementCommentCount(postId:string){
        try{
            const key = this.getCommentKey(postId);
            return await redisClient.decr(key)
        }catch(error){
            console.error('Error decrementing comment count in redis',error);
            return null;
        }
    }

    async deleteCommentCount(postId:string){
        try{
            const key = this.getCommentKey(postId);
            await redisClient.del(key);
            return true;
        }catch(error){
            console.error('Error deleting comment count in redis',error);
            return false;
        }
    }

}

export const commentRedis = new CommentRedis();