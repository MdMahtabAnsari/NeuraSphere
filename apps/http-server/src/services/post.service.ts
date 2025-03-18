import { z } from 'zod';
import { mediaRepository } from '../repositories/media.repository';
import { tagRepository } from '../repositories/tag.repository';
import { postRepository } from '../repositories/post.repository';
import { InternalServerError, AppError, NotFoundError, UnauthorisedError } from '../utils/errors';
import { createPost, updatePost, tags, identifier } from '@workspace/schema/post';
import { getTags } from '../utils/helpers/tag.helper';
import { postReactionService } from './postReaction.service';
import { commentService } from './comment.service';
import { commentReactionService } from "./commentReaction.service";
import { viewsService } from "./views.service";
import { postGraph } from '../graph/post.graph';
import { tagGraph } from '../graph/tag.graph';

interface PostsData {
    content: string | null
    media: {
        type: string
        url: string
        id: string
    }[]
    id: string
    createdAt: Date
    updatedAt: Date
    isEdited: boolean
    user: {
        image: string | null
        id: string
        name: string
    }
    tags: {}

}

class PostService {
    async createPost(userId: string, data: z.infer<typeof createPost>) {
        try {
            const tags = data.content ? getTags(data.content) : [];
            const post = await postRepository.createPost(userId, data);
            await postGraph.createPost(post);
            if (data.media) {
                await mediaRepository.createMedia(post.id, data.media);
            }
            if (tags.length) {
                const tagDetails = await tagRepository.createTags(post.id, tags);
                await tagGraph.createPostTags(post.id, tagDetails);
            }
            const postDetails = await postRepository.getPostByIdWithAllData(post.id);
            return {
                ...postDetails,
                reactions: {
                    likeCount: 0,
                    dislikeCount: 0
                },
                reactionStatus: {
                    like: false,
                    dislike: false
                },
                comments: 0,
                views: 0
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in createPost service", error);
            throw new InternalServerError();
        }
    }

    async updatePost(userId: string, data: z.infer<typeof updatePost>) {
        try {
            const isPostExist = await postRepository.getPostById(data.id);
            if (!isPostExist) {
                throw new NotFoundError("Post not found");
            }
            let isUpdated = false;
            if (isPostExist.userId !== userId) {
                throw new UnauthorisedError("You are not allowed to update this post");
            }
            if (data.content && data.content !== isPostExist.content) {
                isUpdated = true;
            }
            const tags = data.content ? getTags(data.content) : [];
            const post = await postRepository.updatePost(data);
            if (tags.length) {
                const tagDetails = await tagRepository.updateTags(post.id, tags);
                await tagGraph.updatePostTags(post.id, tagDetails);
            } else {
                await tagRepository.deleteTags(post.id);
                await tagGraph.deletePostTags(post.id);
            }
            if (data.addMedia?.length) {
                await mediaRepository.createMedia(post.id, data.addMedia);
                isUpdated = true;
            }
            if (data.removeMedia?.length) {
                await mediaRepository.removeMedia(data.removeMedia);
                isUpdated = true;
            }
            if (isUpdated && isPostExist.isEdited === false) {
                const updatedPost = await postRepository.makePostIsEdited(post.id);
                await postGraph.updatePost(updatedPost);
            }
            const updatedPost = await postRepository.getPostByIdWithAllData(post.id);
            const reactionCount = await postReactionService.getPostReactionCount(post.id);
            const postReactionStatus = await postReactionService.getUserReactionStatus(userId, post.id);
            const commentCount = await commentService.getPostCommentsCount(post.id);
            const viewsCount = await viewsService.getPostViews(post.id);
            return {
                ...updatedPost,
                reactions: reactionCount,
                reactionStatus: postReactionStatus,
                comments: commentCount,
                views: viewsCount
            }

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in updatePost service", error);
            throw new InternalServerError();
        }
    }

    async getPostById(userId: string, postId: string) {
        try {
            const post = postRepository.getPostByIdWithAllData(postId);
            const postReaction = postReactionService.getPostReactionCount(postId);
            const postReactionStatus = postReactionService.getUserReactionStatus(postId, userId);
            const commentCount = commentService.getPostCommentsCount(postId);
            const viewsCount = viewsService.getPostViews(postId);
            return {
                post,
                reactions: postReaction,
                reactionStatus: postReactionStatus,
                comments: commentCount,
                views: viewsCount

            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostById service", error);
            throw new InternalServerError();
        }
    }

    async getPostByTags(userId: string, tag: z.infer<typeof tags>, page: number = 1, limit: number = 10) {
        try {
            const posts = await postRepository.getPostByTags(tag, page, limit);
            const totalPage = await postRepository.getPostByTagsPages(tag, limit);
            const postsWithReaction = await this.getPostMetaData(posts, userId)
            return {
                posts: postsWithReaction,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostByTags service", error);
            throw new InternalServerError();
        }
    }

    async deletePost(userId: string, postId: string) {
        try {
            const post = await postRepository.getPostById(postId);
            if (!post) {
                throw new NotFoundError("Post not found");
            }
            if (post.userId !== userId) {
                throw new UnauthorisedError("You are not allowed to delete this post");
            }
            await postRepository.deletePost(postId);
            await postReactionService.removeCache(postId);
            await commentService.removeCache(postId);
            await commentReactionService.removePostCache(postId);
            await viewsService.removeCache(postId);
            await postGraph.deletePost(postId);
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in deletePost service", error);
            throw new InternalServerError();
        }
    }

    async getUserPosts(myId: string, userId: string, page: number = 1, limit: number = 10) {
        try {
            const posts = await postRepository.getUserPosts(userId, page, limit);
            const totalPage = await postRepository.getUserPostsPages(userId, limit);
            const postsWithReaction = await this.getPostMetaData(posts, myId)
            return {
                posts: postsWithReaction,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getUserPosts service", error);
            throw new InternalServerError();
        }
    }

    async getPostByUsernamesAndUseridAndNameAndMobileAndEmail(userId: string, identifiers: z.infer<typeof identifier>, page: number = 1, limit: number = 10) {
        try {
            const posts = await postRepository.getPostByUsernamesAndUseridAndNameAndMobileAndEmail(identifiers, page, limit);
            const totalPage = await postRepository.getPostByUsernamesAndUseridAndNameAndMobileAndEmailPages(identifiers, limit);
            const postsWithReaction = await this.getPostMetaData(posts, userId)
            return {
                posts: postsWithReaction,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostByUsernamesAndUseridAndName service", error);
            throw new InternalServerError();
        }
    }

    private async getPostMetaData(posts: PostsData[], userId: string) {
        try {
            return await Promise.all(posts.map(async (post) => {
                const reactionCount = await postReactionService.getPostReactionCount(post.id);
                const reactionStatus = await postReactionService.getUserReactionStatus(userId, post.id);
                const commentCount = await commentService.getPostCommentsCount(post.id);
                const viewsCount = await viewsService.getPostViews(post.id);
                return {
                    ...post,
                    reactions: reactionCount,
                    reactionStatus,
                    comments: commentCount,
                    views: viewsCount
                };
            }
            ));
        } catch (error) {
            console.error("Error in getPostMetaData service", error);
            throw new InternalServerError();
        }
    }

    async getPostSuggestion(userId: string, page: number = 1, limit: number = 10) {
        try {
            const posts = await postGraph.getPostSuggestion(userId, page, limit);
            const totalPage = await postGraph.getPostSuggestionPages(userId, limit);
            const postData = await postRepository.getPostByArrayOfIds(posts.map((post: any) => post.id));
            const postsWithReaction = await this.getPostMetaData(postData, userId);
            return {
                posts: postsWithReaction,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostSuggestion service", error);
            throw new InternalServerError();
        }
    }

    async getViralPosts(userId: string, page: number = 1, limit: number = 10) {
        try {
            const posts = await postGraph.getViralPosts(page, limit);
            const totalPage = await postGraph.getViralPostsPages(limit);
            const postData = await postRepository.getPostByArrayOfIds(posts.map((post: any) => post.id));
            const postsWithReaction = await this.getPostMetaData(postData, userId);
            return {
                posts: postsWithReaction,
                totalPage,
                currentPage: page
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getViralPosts service", error);
            throw new InternalServerError();
        }
    }

}

export const postService = new PostService();