import { followerService } from "../services/follower.service";
import {Request,Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import {pageLimitObj,followingIdObj,idObj} from "@workspace/schema/follower";
import {z} from "zod";

class FollowerController{
    async getFollowers(req:Request,res:Response,next:NextFunction){
        try{
            const {id} = req.params as z.infer<typeof idObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const followers = await followerService.getFollowers(id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Followers fetched successfully",
                status:"success",
                data:followers
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFollowing(req:Request,res:Response,next:NextFunction){
        try{
            const {id} = req.params as z.infer<typeof idObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const following = await followerService.getFollowing(id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Following fetched successfully",
                status:"success",
                data:following
            });
        }
        catch(error){
            next(error);
        }
    }

    async getMutualFollowers(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {followingId} = req.params as z.infer<typeof followingIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const mutual = await followerService.getMutualFollowers(userId,followingId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Mutual followers fetched successfully",
                status:"success",
                data:mutual
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFollowerSuggestions(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const suggestions = await followerService.getFollowerSuggestions(userId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Follower suggestions fetched successfully",
                status:"success",
                data:suggestions
            });
        }
        catch(error){
            next(error);
        }
    }

    async followUser(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {followingId} = req.body as z.infer<typeof followingIdObj>;
            const follow = await followerService.followUser(userId,followingId);
            res.status(200).json({
                message:"User followed successfully",
                status:"success",
                data:follow
            });
        }
        catch(error){
            next(error);
        }
    }

    async unfollowUser(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {followingId} = req.params as z.infer<typeof followingIdObj>;
            const unfollow = await followerService.unfollowUser(userId,followingId);
            res.status(200).json({
                message:"User unfollowed successfully",
                status:"success",
                data:unfollow
            });
        }
        catch(error){
            next(error);
        }
    }
}

export const followerController = new FollowerController();