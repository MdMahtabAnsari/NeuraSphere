import { createPost, updatePost, identifier, tags } from "@workspace/schema/post"
import { z } from "zod"
import { InternalServerError, NotFoundError, AppError, ConflictError, BadRequestError } from "../utils/errors"
import { client, Prisma } from "@workspace/database/client"

class PostReactionRepository {

    async likePost(userId: string, postId: string) {
        try {
            const post = await client.post.findFirst({
                where: {
                    id: postId
                }
            });
            if (!post) {
                throw new NotFoundError('Post not found');
            }
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
                throw new ConflictError('Post already liked');
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Error liking post');
        }
    }

    async unlikePost(userId: string, postId: string) {
        try {
            const post = await client.post.findFirst({
                where: {
                    id: postId
                }
            });
            if (!post) {
                throw new NotFoundError('Post not found');
            }
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
                throw new BadRequestError('Post not liked');
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Error unliking post');
        }
    }
    async dislikePost(userId: string, postId: string) {
        try {
            const post = await client.post.findFirst({
                where: {
                    id: postId
                }
            });
            if (!post) {
                throw new NotFoundError('Post not found');
            }
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
                throw new ConflictError('Post already disliked');
            }
            else if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Error disliking post');
        }
    }

    async removeDislikePost(userId: string, postId: string) {
        try {
            const post = await client.post.findFirst({
                where: {
                    id: postId
                }

            });
            if (!post) {
                throw new NotFoundError('Post not found');
            }
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
                throw new BadRequestError('Post not disliked');
            }
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Error removing dislike from post');
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
            throw new InternalServerError('Error getting post like count');
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
            throw new InternalServerError('Error getting post dislike count');
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
            throw new InternalServerError('Error getting user reaction status');
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
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }

                },
            });
            return users;

        } catch (error) {
            console.error('Error getting liked users', error);
            throw new InternalServerError('Error getting liked users');
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
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }

                },
            });
            return users;
        } catch (error) {
            console.error('Error getting disliked users', error);
            throw new InternalServerError('Error getting disliked users');
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
            throw new InternalServerError('Error getting liked users pages');
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
            throw new InternalServerError('Error getting disliked users pages');
        }
    }
}

export const postReactionRepository = new PostReactionRepository();