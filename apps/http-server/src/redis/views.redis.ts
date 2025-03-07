import { redisClient } from "./redisClient";

class ViewsRedis{

    getViewsKey(postId:string){
        return `post:${postId}:views`;
    }

    async setViews(postId:string,count:number){
        try{
            const key = this.getViewsKey(postId);
            await redisClient.set(key,count);
            await redisClient.expire(key,60*60);
            return true;
        }catch(error){
            console.error('Error setting post view count in redis',error);
            return false;
        }
    }

    async getViews(postId:string){
        try{
            const key = this.getViewsKey(postId);
            const count = await redisClient.get(key);
            return count ? parseInt(count) : null;
        }catch(error){
            console.error('Error getting post view count from redis',error);
            return null;
        }
    }

    async incrementsViews(postId:string){
        try{
            const key = this.getViewsKey(postId);
            return await redisClient.incr(key);
        }catch(error){
            console.error('Error incrementing post view count in redis',error);
            return null;
        }
    }

    async decrementsViews(postId:string){
        try{
            const key = this.getViewsKey(postId);
            return await redisClient.decr(key);
        }catch(error){
            console.error('Error decrementing post view count in redis',error);
            return null;
        }
    }

    async deleteViews(postId:string){
        try{
            const key = this.getViewsKey(postId);
            return await redisClient.del(key);
        }catch(error){
            console.error('Error deleting post view count in redis',error);
            return null;
        }
    }
}

export const viewsRedis = new ViewsRedis();