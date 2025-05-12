import { commentReactionRepository } from "../repositories/commentReaction.repository";
import { AppError, InternalServerError } from "../utils/errors";
import { commentReactionRedis } from "../redis/commentReaction.redis";
import { notificationService } from './notification.service';

class CommentReactionService {
    async likeComment(userId: string, commentId: string, postId: string) {
        try {
            const like = await commentReactionRepository.likeComment(commentId, userId);
            let likeCount = 0;
            if (like) {
                if (like.isDisliked) {
                    const cachedDislikeCount = await commentReactionRedis.getDislike(postId, commentId);
                    if (cachedDislikeCount !== null) {
                        await commentReactionRedis.decreaseDislikeCount(postId, commentId)
                    } else {
                        const disLikeCount = await commentReactionRepository.getCommentDislikeCount(commentId);
                        await commentReactionRedis.setDislike(postId, commentId, disLikeCount);

                    }
                }
                const cachedLikeCount = await commentReactionRedis.getLike(postId, commentId);
                if (cachedLikeCount !== null) {
                    const count = await commentReactionRedis.increaseLikeCount(postId, commentId);
                    likeCount = count ? count : likeCount;
                } else {
                    const count = await commentReactionRepository.getCommentLikeCount(commentId);
                    await commentReactionRedis.setLike(postId, commentId, count);
                    likeCount = count;
                }
                if(userId!== like.like.userId){
                    await notificationService.createNotification({
                        senderId: userId,
                        receiverId: like.like.userId,
                        commentId: commentId,
                        postId: postId,
                        type: 'Like',
                    });
                }
            }
            return likeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error liking comment', error);
            throw new InternalServerError();
        }
    }

    async dislikeComment(userId: string, commentId: string, postId: string) {
        try {
            const dislike = await commentReactionRepository.dislikeComment(commentId, userId);
            let dislikeCount = 0;
            if (dislike) {
                if (dislike.isLiked) {
                    const cachedLikeCount = await commentReactionRedis.getLike(postId, commentId);
                    if (cachedLikeCount !== null) {
                        await commentReactionRedis.decreaseLikeCount(postId, commentId);
                    } else {
                        const likeCount = await commentReactionRepository.getCommentLikeCount(commentId);
                        await commentReactionRedis.setLike(postId, commentId, likeCount);

                    }
                }
                const cachedDislikeCount = await commentReactionRedis.getDislike(postId, commentId);
                if (cachedDislikeCount !== null) {
                    const count = await commentReactionRedis.increaseDislikeCount(postId, commentId);
                    dislikeCount = count ? count : dislikeCount;
                } else {
                    const count = await commentReactionRepository.getCommentDislikeCount(commentId);
                    await commentReactionRedis.setDislike(postId, commentId, count);
                    dislikeCount = count;
                }
                await commentReactionRedis.setUserReactionStatus(postId, commentId, userId, { like: false, dislike: true });
                if(userId!== dislike.dislike.userId){
                    await notificationService.createNotification({
                        senderId: userId,
                        receiverId: dislike.dislike.userId,
                        commentId: commentId,
                        postId: postId,
                        type: 'Dislike',
                    });
                }
            }
            return dislikeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error disliking comment', error);
            throw new InternalServerError();
        }
    }

    async unlikeComment(userId: string, commentId: string, postId: string) {
        try {
            const unlike = await commentReactionRepository.unlikeComment(commentId, userId);
            let likeCount = 0;
            if (unlike) {
                const cachedLikeCount = await commentReactionRedis.getLike(postId, commentId);
                if (cachedLikeCount !== null) {
                    const count = await commentReactionRedis.decreaseLikeCount(postId, commentId);
                    likeCount = count ? count : likeCount;
                } else {
                    const count = await commentReactionRepository.getCommentLikeCount(commentId);
                    await commentReactionRedis.setLike(postId, commentId, count);
                    likeCount = count;
                }
                await commentReactionRedis.setUserReactionStatus(postId, commentId, userId, { like: false, dislike: false });
            }
            return likeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error unliking comment', error);
            throw new InternalServerError();
        }
    }

    async removeDislikeComment(userId: string, commentId: string, postId: string) {
        try {
            const removeDislike = await commentReactionRepository.removeDislikeComment(commentId, userId);
            let dislikeCount = 0;
            if (removeDislike) {
                const cachedDislikeCount = await commentReactionRedis.getDislike(postId, commentId);
                if (cachedDislikeCount !== null) {
                    const count = await commentReactionRedis.decreaseDislikeCount(postId, commentId);
                    dislikeCount = count ? count : dislikeCount;
                } else {
                    const count = await commentReactionRepository.getCommentDislikeCount(commentId);
                    await commentReactionRedis.setDislike(postId, commentId, count);
                    dislikeCount = count;
                }
                await commentReactionRedis.setUserReactionStatus(postId, commentId, userId, { like: false, dislike: false });
            }
            return dislikeCount;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error removing dislike from comment', error);
            throw new InternalServerError();
        }
    }

    async getLikedUsers(commentId: string, page: number = 1, limit: number = 10) {
        try {
            const users = await commentReactionRepository.likedUsers(commentId, page, limit);
            const totalPage = await commentReactionRepository.getLikeUsersPages(commentId, limit);
            return {
                users,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error getting liked users', error);
            throw new InternalServerError();
        }
    }
    async getDislikedUsers(commentId: string, page: number = 1, limit: number = 10) {
        try {
            const users = await commentReactionRepository.dislikedUsers(commentId, page, limit);
            const totalPage = await commentReactionRepository.getDislikeUsersPages(commentId, limit);
            return {
                users,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error getting disliked users', error);
            throw new InternalServerError();
        }
    }

    async removePostCache(postId: string) {
        try {
            await commentReactionRedis.removeCacheByPostId(postId);
        } catch (error) {
            console.error('Error removing post cache', error);
            throw new InternalServerError();
        }
    }
    async removeCommentCache(postId: string, commentId: string) {
        try {
            await commentReactionRedis.removeCacheOfComment(postId, commentId);
        } catch (error) {
            console.error('Error removing comment cache', error);
            throw new InternalServerError();
        }
    }

    async getCommentReactionCount(postId: string, commentId: string) {
        try {
            const cachedLikeCount = await commentReactionRedis.getLike(postId, commentId);
            const cachedDislikeCount = await commentReactionRedis.getDislike(postId, commentId);
            if(cachedLikeCount !== null && cachedDislikeCount !== null) {
                return {
                    likeCount: cachedLikeCount,
                    dislikeCount: cachedDislikeCount
                }
            }
            const likeCount = await commentReactionRepository.getCommentLikeCount(commentId);
            const dislikeCount = await commentReactionRepository.getCommentDislikeCount(commentId);
            await commentReactionRedis.setLike(postId, commentId, likeCount);
            await commentReactionRedis.setDislike(postId, commentId, dislikeCount);
            return {
                likeCount,
                dislikeCount
            };
        } catch (error) {
            console.error('Error getting comment reaction count', error);
            throw new InternalServerError();
        }
    }

    async getUserReactionStatus(postId: string, commentId: string, userId: string) {
        try {
           return await commentReactionRepository.getCommentReactionStatus(commentId, userId);

        } catch (error) {
            console.error('Error getting user reaction status', error);
            throw new InternalServerError();
        }
    }
}

export const commentReactionService = new CommentReactionService();