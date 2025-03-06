import {Request,Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import { id,pageLimitObj,postIdCommentIdObj,commentIdObj } from "@workspace/schema/reaction";
import { z } from "zod";
import {commentReactionService} from "../services/commentReaction.service";

class CommentReactionController {
    async likeComment(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {commentId,postId} = req.body as z.infer<typeof postIdCommentIdObj>;
            const likeCount = await commentReactionService.likeComment(req.user.id,commentId,postId);
            res.status(201).json({
                message: "Comment liked successfully",
                status: "success",
                data: likeCount,
            });
        }catch(error){
            next(error);
        }
    }
    async dislikeComment(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {commentId,postId} = req.body as z.infer<typeof postIdCommentIdObj>;
            const dislikeCount = await commentReactionService.dislikeComment(req.user.id,commentId,postId);
            res.status(201).json({
                message: "Comment disliked successfully",
                status: "success",
                data: dislikeCount,
            });
        }catch(error){
            next(error);
        }
    }

    async unLikeComment(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {commentId,postId} = req.params as z.infer<typeof postIdCommentIdObj>;
            const likeCount = await commentReactionService.unlikeComment(req.user.id,commentId,postId);
            res.status(200).json({
                message: "Comment unliked successfully",
                status: "success",
                data: likeCount,
            });
        }catch(error){
            next(error);
        }
    }

    async removeDislikeComment(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {commentId,postId} = req.params as z.infer<typeof postIdCommentIdObj>;
            const dislikeCount = await commentReactionService.removeDislikeComment(req.user.id,commentId,postId);
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
            const {commentId} = req.params as z.infer<typeof commentIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const users = await commentReactionService.getLikedUsers(commentId,page?parseInt(page):1,limit?parseInt(limit):10);
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
            const {commentId} = req.params as z.infer<typeof commentIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const users = await commentReactionService.getDislikedUsers(commentId,page?parseInt(page):1,limit?parseInt(limit):10);
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

export const commentReactionController = new CommentReactionController();