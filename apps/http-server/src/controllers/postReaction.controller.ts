import {Request,Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import { pageLimitObj,postIdObj } from "@workspace/schema/reaction";
import { z } from "zod";
import { postReactionService } from "../services/postReaction.service";

class PostReactionController{
    async likePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {postId} = req.body as z.infer<typeof postIdObj>;
            const likeCount = await postReactionService.likePost(req.user.id,postId);
            res.status(201).json({
                message: "Post liked successfully",
                status: "success",
                data: likeCount,
            });
        }catch(error){
            next(error);
        }
    }

    async dislikePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {postId} = req.body as z.infer<typeof postIdObj>;
            const dislikeCount = await postReactionService.dislikePost(req.user.id,postId);
            res.status(201).json({
                message: "Post disliked successfully",
                status: "success",
                data: dislikeCount,
            });
        }catch(error){
            next(error);
        }
    }
    async unLikePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {postId} = req.params as z.infer<typeof postIdObj>;
            const likeCount = await postReactionService.unLikePost(req.user.id,postId);
            res.status(200).json({
                message: "Post unliked successfully",
                status: "success",
                data: likeCount,
            });
        }catch(error){
            next(error);
        }
    }

    async removeDislikePost(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {postId} = req.params as z.infer<typeof postIdObj>;
            const dislikeCount = await postReactionService.removeDislikePost(req.user.id,postId);
            res.status(200).json({
                message: "Dislike removed successfully",
                status: "success",
                data: dislikeCount,
            });
        }catch(error){
            next(error);
        }
    }

    async getLikedUsers(req:Request,res:Response,next:NextFunction){
        try{
            const {postId} = req.params as z.infer<typeof postIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const users = await postReactionService.getLikedUsers(postId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Liked users fetched successfully",
                status: "success",
                data: users,
            });
        }catch(error){
            next(error);
        }
    }

    async getDislikedUsers(req:Request,res:Response,next:NextFunction){
        try{
            const {postId} = req.params as z.infer<typeof postIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const users = await postReactionService.getDislikedUsers(postId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message: "Disliked users fetched successfully",
                status: "success",
                data: users,
            });
        }catch(error){
            next(error);
        }
    }
}

export const postReactionController = new PostReactionController();