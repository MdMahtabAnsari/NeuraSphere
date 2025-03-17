import { postService } from "../services/post.service";
import {Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import { createPost,updatePost,id,getPostByTags,pageLimitObj,getPostByUsernamesAndUseridAndNameAndMobileAndEmail } from "@workspace/schema/post";
import { z } from "zod";

class PostController{
    async createPost(req:CustomRequest,res:Response,next:NextFunction){
        try {
            const data:z.infer<typeof createPost> ={
                content:req.body.content,
                media:req.body.media,
            }
            const post = await postService.createPost(req.user.id,data);
            res.status(201).json({
                message: "Post created successfully",
                status: "success",
                data: post,
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const data:z.infer<typeof updatePost> ={
                id:req.body.id,
                content:req.body.content,
                addMedia:req.body.addMedia,
                removeMedia:req.body.removeMedia,
            }
            const post = await postService.updatePost(req.user.id,data);
            res.status(200).json({
                message: "Post updated successfully",
                status: "success",
                data: post,
            });
        }catch(error){
            next(error);
        }
    }

    async deletePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const postId = req.params.id as z.infer<typeof id>;
            await postService.deletePost(req.user.id,postId);
            res.status(200).json({
                message: "Post deleted successfully",
                status: "success",
            });
        }catch(error){
            next(error);
        }
    }

    async getPostByTag(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {tags,page,limit} = req.query as z.infer<typeof getPostByTags>;
            const posts = await postService.getPostByTags(req.user.id,tags,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }

    async getPostById(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const postId = req.params.id as z.infer<typeof id>;
            const post = await postService.getPostById(req.user.id,postId);
            res.status(200).json({
                message: "Post fetched successfully",
                status: "success",
                data: post,
            });
        }catch(error){
            next(error);
        }
    }

    async getUserPosts(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const posts = await postService.getUserPosts(req.user.id,req.user.id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }

    async getOtherUserPosts(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const userId = req.params.userId as z.infer<typeof id>;
            const posts = await postService.getUserPosts(req.user.id,userId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }

    async getPostByUsernamesAndUseridAndNameAndMobileAndEmail(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {identifier,page,limit} = req.query as z.infer<typeof getPostByUsernamesAndUseridAndNameAndMobileAndEmail>;
            const posts = await postService.getPostByUsernamesAndUseridAndNameAndMobileAndEmail(req.user.id,identifier,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }

    async getPostSuggestion(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const posts = await postService.getPostSuggestion(req.user.id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }
    async getViralPosts(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const posts = await postService.getViralPosts(req.user.id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Posts fetched successfully",
                status: "success",
                data: posts,
            });
        }catch(error){
            next(error);
        }
    }
}

export const postController = new PostController();