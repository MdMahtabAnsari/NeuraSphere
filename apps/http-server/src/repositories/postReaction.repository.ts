import { InternalServerError, NotFoundError, AppError, ConflictError, BadRequestError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"

class PostReactionRepository {

    async likePost(userId: string, postId: string) {
        try {
            let isDislikedStatus = false;
            const isDisliked = await client.post_Reaction.findFirst({
                where: {
                    postId,
                    userId,
                    type: 'Dislike'
                }
            });
            if (isDisliked) {
                await client.post_Reaction.delete({
                    where: {
                        postId_userId: {
                            postId,
                            userId
                        }
                    }
                });
                isDislikedStatus = true;
            }
            const like = await client.post_Reaction.create({
                data: {
                    userId,
                    postId,
                    type: 'Like'
                }
            });
            return {
                like,
                isDisliked: isDislikedStatus
            }
        } catch (error) {
            console.error('Error liking post', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025'){
                    throw new NotFoundError('Post');
                }
                else if(error.code === 'P2002'){
                    throw new ConflictError('like');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError();
        }
    }

    async unlikePost(userId: string, postId: string) {
        try {
            const like = await client.post_Reaction.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId,
                    },
                    type: 'Like'
                }
            })
            return like;
        } catch (error) {
            console.error('Error unliking post', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025'){
                    throw new NotFoundError('Post');
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError('like');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError();
        }
    }
    async dislikePost(userId: string, postId: string) {
        try {
            let isLikedStatus = false;
            const isLiked = await client.post_Reaction.findFirst({
                where: {
                    postId,
                    userId,
                    type: 'Like'
                }
            });
            if (isLiked) {
                await client.post_Reaction.delete({
                    where: {
                        postId_userId: {
                            postId,
                            userId
                        }
                    }
                });
                isLikedStatus = true;
            }
            const dislike = await client.post_Reaction.create({
                data: {
                    userId,
                    postId,
                    type: 'Dislike'
                }
            });
            return {
                dislike,
                isLiked: isLikedStatus
            }
        } catch (error) {
            console.error('Error disliking post', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025'){
                    throw new NotFoundError('Post');
                }
                else if(error.code === 'P2002'){
                    throw new ConflictError('dislike');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError();
        }
    }

    async removeDislikePost(userId: string, postId: string) {
        try {
            const dislike = await client.post_Reaction.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId
                    },
                    type: 'Dislike'
                }
            })
            return dislike;
        } catch (error) {
            console.error('Error removing dislike from post', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025'){
                    throw new NotFoundError('Post');
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError('disliked');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError();
        }
    }

    async getPostLikeCount(postId: string) {
        try {
            const likeCount = await client.post_Reaction.count({
                where: {
                    postId,
                    type: 'Like'
                }
            });
            return likeCount;
        } catch (error) {
            console.error('Error getting post like count', error);
            throw new InternalServerError();
        }
    }

    async getPostDislikeCount(postId: string) {
        try {
            const dislikeCount = await client.post_Reaction.count({
                where: {
                    postId,
                    type: 'Dislike'
                }
            });
            return dislikeCount;
        } catch (error) {
            console.error('Error getting post dislike count', error);
            throw new InternalServerError();
        }
    }

    async getUserReactionStatus(userId: string, postId: string) {
        try {
            const reaction = await client.post_Reaction.findFirst({
                where: {
                    postId,
                    userId
                }
            });
            if (reaction) {
                return reaction.type === 'Like' ? { like: true, dislike: false } : { like: false, dislike: true };
            }
            return { like: false, dislike: false };
        } catch (error) {
            console.error('Error getting user reaction status', error);
            throw new InternalServerError();
        }
    }

    async getLikedUsers(postId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await client.post_Reaction.findMany({
                where: {
                    postId,
                    type: 'Like'
                },
                skip: skip,
                take: limit,
                orderBy:{
                    createdAt:'desc'
                },
                select: {
                    id:true,
                    postId:true,
                    type:true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    createdAt:true,
                    updatedAt:true

                },
            });
            return users;

        } catch (error) {
            console.error('Error getting liked users', error);
            throw new InternalServerError();
        }
    }
    async getDislikedUsers(postId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const users = await client.post_Reaction.findMany({
                where: {
                    postId,
                    type: 'Dislike'
                },
                skip: skip,
                take: limit,
                orderBy:{
                    createdAt:"desc"
                },
                select: {
                    id:true,
                    postId:true,
                    type:true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    createdAt:true,
                    updatedAt:true

                },
            });
            return users;
        } catch (error) {
            console.error('Error getting disliked users', error);
            throw new InternalServerError();
        }
    }

    async getLikedUsersPages(postId: string, limit: number = 10) {
        try {
            const total = await client.post_Reaction.count({
                where: {
                    postId,
                    type: 'Like'
                }
            });
            return Math.ceil(total / limit);
        } catch (error) {
            console.error('Error getting liked users pages', error);
            throw new InternalServerError();
        }
    }

    async getDislikedUsersPages(postId: string, limit: number = 10) {
        try {
            const total = await client.post_Reaction.count({
                where: {
                    postId,
                    type: 'Dislike'
                }
            });
            return Math.ceil(total / limit);
        } catch (error) {
            console.error('Error getting disliked users pages', error);
            throw new InternalServerError();
        }
    }
}

export const postReactionRepository = new PostReactionRepository();