import { z } from 'zod';
import { mediaRepository } from '../repositories/media.repository';
import { tagRepository } from '../repositories/tag.repository';
import { postRepository } from '../repositories/post.repository';
import { InternalServerError, AppError,NotFoundError,UnauthorisedError } from '../utils/errors';
import { createPost,updatePost,tags,identifier } from '@workspace/schema/post';
import { getTags } from '../utils/helpers/tag.helper';

export class PostService {
    async createPost(userId: string, data: z.infer<typeof createPost>) {
        try {
            const tags = data.content ? getTags(data.content) : [];
            const post = await postRepository.createPost(userId, data);
            if (data.media) {
                await mediaRepository.createMedia(post.id, data.media);
            }
            if(tags.length){
                await tagRepository.createTags(post.id,tags);
            }
            return await postRepository.getPostByIdWithAllData(post.id);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in createPost service", error);
            throw new InternalServerError();
        }
    }

    async updatePost(userId:string,data: z.infer<typeof updatePost>) {
        try {
            const isPostExist = await postRepository.getPostById(data.id);
            if (!isPostExist) {
                throw new NotFoundError("Post not found");
            }
            let isUpdated = false;
            if(isPostExist.userId !== userId){
                throw new UnauthorisedError("You are not allowed to update this post");
            }
            if(data.content && data.content !== isPostExist.content){
                isUpdated = true;
            }
            const tags = data.content ? getTags(data.content) : [];
            const post = await postRepository.updatePost(data);
            if(tags.length){
                await tagRepository.updateTags(post.id,tags);
            }else{
                await tagRepository.deleteTags(post.id);
            }
            if(data.addMedia?.length){
                await mediaRepository.createMedia(post.id,data.addMedia);
                isUpdated = true;
            }
            if(data.removeMedia?.length){
                await mediaRepository.removeMedia(data.removeMedia);
                isUpdated = true;
            }
            if(isUpdated && isPostExist.isEdited === false){
                await postRepository.makePostIsEdited(post.id);
            }
            return await postRepository.getPostByIdWithAllData(post.id);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in updatePost service", error);
            throw new InternalServerError();
        }
    }

    async getPostById(postId: string) {
        try {
            return await postRepository.getPostByIdWithAllData(postId);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostById service", error);
            throw new InternalServerError();
        }
    }

    async getPostByTags(tag:z.infer<typeof tags>,page:number=1,limit:number=10){
        try{
            return await postRepository.getPostByTags(tag,page,limit);
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostByTags service", error);
            throw new InternalServerError();
        }
    }

    async deletePost(userId:string,postId:string){
        try{
            const post = await postRepository.getPostById(postId);
            if(!post){
                throw new NotFoundError("Post not found");
            }
            if(post.userId !== userId){
                throw new UnauthorisedError("You are not allowed to delete this post");
            }
            await postRepository.deletePost(postId);
            return true;
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in deletePost service", error);
            throw new InternalServerError();
        }
    }

    async getUserPosts(userId:string,page:number=1,limit:number=10){
        try{
            return await postRepository.getUserPosts(userId,page,limit);
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getUserPosts service", error);
            throw new InternalServerError();
        }
    }

    async getPostByUsernamesAndUseridAndNameAndMobileAndEmail(identifiers:z.infer<typeof identifier>,page:number=1,limit:number=10){
        try{
            return await postRepository.getPostByUsernamesAndUseridAndNameAndMobileAndEmail(identifiers,page,limit);
        }catch(error){
            if (error instanceof AppError) {
                throw error;
            }
            console.error("Error in getPostByUsernamesAndUseridAndName service", error);
            throw new InternalServerError();
        }
    }

}

export const postService = new PostService();