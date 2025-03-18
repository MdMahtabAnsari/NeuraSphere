import { postReactionRepository } from "../repositories/postReaction.repository";
import { postReactionRedis } from "../redis/postReaction.redis";
import { AppError, InternalServerError } from "../utils/errors";
import { postReactionGraph } from "../graph/postReaction.graph";

class PostReactionService {
    async likePost(userId: string, postId: string) {
        try {
            const like = await postReactionRepository.likePost(userId, postId);
            let likeCount = 0;
            if (like) {
                if (like.isDisliked) {
                    const cachedDislikeCount = await postReactionRedis.getDislike(postId);
                    if (cachedDislikeCount !== null) {
                        await postReactionRedis.decrementsDislike(postId);
                    } else {
                        const disLikeCount = await postReactionRepository.getPostDislikeCount(postId);
                        await postReactionRedis.setDislike(postId, disLikeCount);
                    }
                }
                const cachedLikeCount = await postReactionRedis.getLike(postId);
                if (cachedLikeCount !== null) {
                    const count = await postReactionRedis.incrementsLike(postId);
                    likeCount = count ? count : likeCount;
                } else {
                    const count = await postReactionRepository.getPostLikeCount(postId);
                        await postReactionRedis.setLike(postId, likeCount);
                        likeCount = count;
                }
                await postReactionGraph.likePost(postId, userId);
                await postReactionRedis.setUserReactionStatus(postId, userId, { like: true, dislike: false });
            }
            return likeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error liking post", error);
            throw new InternalServerError();
        }
    }

    async dislikePost(userId: string, postId: string) {
        try {
            const dislike = await postReactionRepository.dislikePost(userId, postId);
            let dislikeCount = 0;
            if (dislike) {
                if (dislike.isLiked) {
                    const cachedLikeCount = await postReactionRedis.getLike(postId);
                    if (cachedLikeCount !== null) {
                        await postReactionRedis.decrementsLike(postId);
                    } else {
                        const likeCount = await postReactionRepository.getPostLikeCount(postId);
                        await postReactionRedis.setLike(postId, likeCount);

                    }
                }
                const cachedDislikeCount = await postReactionRedis.getDislike(postId);
                if (cachedDislikeCount !== null) {
                    const count = await postReactionRedis.incrementsDislike(postId);
                    dislikeCount = count ? count : dislikeCount;
                } else {
                    const count = await postReactionRepository.getPostDislikeCount(postId);
                    await postReactionRedis.setDislike(postId, count);
                    dislikeCount = count;
                }
                await postReactionGraph.dislikePost(postId, userId);
                await postReactionRedis.setUserReactionStatus(postId, userId, { like: false, dislike: true });
            }
            return dislikeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error disliking post", error);
            throw new InternalServerError();
        }
    }

    async getPostReactionCount(postId: string) {
        try {
            const cachedLikeCount = await postReactionRedis.getLike(postId);
            const cachedDislikeCount = await postReactionRedis.getDislike(postId);
            if (cachedLikeCount !== null && cachedDislikeCount !== null) {
                return { likeCount: cachedLikeCount, dislikeCount: cachedDislikeCount };
            }
            const likeCount = await postReactionRepository.getPostLikeCount(postId);
            const dislikeCount = await postReactionRepository.getPostDislikeCount(postId);
            await postReactionRedis.setLike(postId, likeCount);
            await postReactionRedis.setDislike(postId, dislikeCount);
            return { likeCount, dislikeCount };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error getting post reaction count", error);
            throw new InternalServerError();
        }
    }

    async getUserReactionStatus(userId: string, postId: string) {
        try {
            const cachedStatus = await postReactionRedis.getUserReactionStatus(postId, userId);
            if (cachedStatus) {
                return cachedStatus;
            }
            const reaction = await postReactionRepository.getUserReactionStatus(userId, postId);
            await postReactionRedis.setUserReactionStatus(postId, userId, reaction);
            return reaction;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error getting user reaction status", error);
            throw new InternalServerError();
        }
    }

    async removeCache(postId: string) {
        try {
            await postReactionRedis.removeCacheByPostId(postId);
            return true;
        } catch (error) {
            console.error("Error removing cache", error);
            throw new InternalServerError();
        }
    }

    async unLikePost(userId: string, postId: string) {
        try {
            const unLiked = await postReactionRepository.unlikePost(userId, postId);
            let likeCount = 0;
            if (unLiked) {
                const cachedLikeCount = await postReactionRedis.getLike(postId);
                if (cachedLikeCount !== null) {
                    const count = await postReactionRedis.decrementsLike(postId);
                    likeCount = count ? count : likeCount;
                } else {
                    const count = await postReactionRepository.getPostLikeCount(postId);
                        await postReactionRedis.setLike(postId, count);
                        likeCount = count;
                }
                await postReactionGraph.unlikePost(postId, userId);
                await postReactionRedis.setUserReactionStatus(postId, userId, { like: false, dislike: false });
            }
            return likeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error unliking post", error);
            throw new InternalServerError();
        }
    }

    async removeDislikePost(userId: string, postId: string) {
        try {
            const removed = await postReactionRepository.removeDislikePost(userId, postId);
            let dislikeCount = 0;
            if (removed) {
                const cachedDislikeCount = await postReactionRedis.getDislike(postId);
                if (cachedDislikeCount !== null) {
                    const count = await postReactionRedis.decrementsDislike(postId);
                    dislikeCount = count ? count : dislikeCount;
                } else {
                    const count = await postReactionRepository.getPostDislikeCount(postId);
                        await postReactionRedis.setDislike(postId, count);
                        dislikeCount = count;
                }
                await postReactionGraph.removeDislikePost(postId, userId);
                await postReactionRedis.setUserReactionStatus(postId, userId, { like: false, dislike: false });
            }
            return dislikeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error removing dislike from post", error);
            throw new InternalServerError();
        }
    }

    async getLikedUsers(postId: string,page:number=1,limit:number=10){
        try{
            const users = await postReactionRepository.getLikedUsers(postId,page,limit);
            const totalPage = await postReactionRepository.getLikedUsersPages(postId,limit);
            return {
                users,
                totalPage,
                currentPage: page
            }
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error getting liked users", error);
            throw new InternalServerError();
        }
    }

    async getDislikedUsers(postId: string,page:number=1,limit:number=10){
        try{
            const users = await postReactionRepository.getDislikedUsers(postId,page,limit);
            const totalPage = await postReactionRepository.getDislikedUsersPages(postId,limit);
            return {
                users,
                totalPage,
                currentPage: page
            }
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error getting disliked users", error);
            throw new InternalServerError();
        }
    }
}

export const postReactionService = new PostReactionService();