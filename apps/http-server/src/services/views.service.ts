import {viewsRepository} from "../repositories/views.repository";
import {viewsRedis} from "../redis/views.redis";
import {AppError,InternalServerError} from "../utils/errors";

class ViewsService {
    async createView(postId: string, userId: string) {
        try {
            const views = await viewsRepository.createView(postId, userId);
            let viewsCount = 0;
            if(views){
                viewsCount = await viewsRepository.getPostViews(postId);
                await viewsRedis.setViews(postId, viewsCount);
            }
            return viewsCount;
        } catch (error) {
            console.error("Error creating view", error);
            throw new InternalServerError();
        }
    }

    async getPostViews(postId: string) {
        try {
            const cachedViews = await viewsRedis.getViews(postId);
            if(cachedViews){
                return cachedViews;
            }
            const views = await viewsRepository.getPostViews(postId);
            await viewsRedis.setViews(postId, views);
            return views;
        } catch (error) {
            console.error("Error getting post views", error);
            throw new InternalServerError();
        }
    }

    async removeCache(postId: string) {
        try {
            await viewsRedis.deleteViews(postId);
        } catch (error) {
            console.error("Error removing cache", error);
            throw new InternalServerError();
        }
    }
}

export const viewsService = new ViewsService();