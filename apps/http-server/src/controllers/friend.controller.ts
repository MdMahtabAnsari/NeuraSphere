import { friendService } from "../services/friend.service";
import {Request,Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import {friendIdObj,pageLimitObj,idObj} from "@workspace/schema/friend";
import {z} from "zod";

class FriendController{
    async blockFriend(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const blockedFriend =await friendService.blockFriend(userId,friendId);
            res.status(200).json({
                message:"Friend blocked successfully",
                status:"success",
                data:blockedFriend
            });
        }
        catch(error){
            next(error);
        }
    }
    async unblockFriend(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const unBlockedFriend =await friendService.unblockFriend(userId,friendId);
            res.status(200).json({
                message:"Friend unblocked successfully",
                status:"success",
                data:unBlockedFriend
            });
        }
        catch(error){
            next(error);
        }
    }

    async getBlockedFriends(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const friends = await friendService.getBlockedFriends(userId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Blocked friends fetched successfully",
                status:"success",
                data:friends
            });
        }
        catch(error){
            next(error);
        }
    }

    async removeFriend(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const removedFriend=await friendService.removeFriend(userId,friendId);
            res.status(200).json({
                message:"Friend removed successfully",
                status:"success",
                data:removedFriend
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFriendshipStatus(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.params as z.infer<typeof friendIdObj>;
            const status = await friendService.getFriendshipStatus(userId,friendId);
            res.status(200).json({
                message:"Friendship status fetched successfully",
                status:"success",
                data:status
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFriends(req:Request,res:Response,next:NextFunction){
        try{
            const {id} = req.params as z.infer<typeof idObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const friends = await friendService.getFriends(id,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Friends fetched successfully",
                status:"success",
                data:friends
            });
        }
        catch(error){
            next(error);
        }
    }

    async createFriendRequest(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const requested=await friendService.createFriendRequest(userId,friendId);
            res.status(200).json({
                message:"Friend request sent successfully",
                status:"success",
                data:requested
            });
        }
        catch(error){
            next(error);
        }
    }

    async removeFriendRequest(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const removed=await friendService.removeFriendRequest(userId,friendId);
            res.status(200).json({
                message:"Friend request removed successfully",
                status:"success",
                data:removed
            });
        } catch (error) {
            next(error);
        }
    }

    async acceptFriendRequest(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const accept=await friendService.acceptFriendRequest(userId,friendId);
            res.status(200).json({
                message:"Friend request accepted successfully",
                status:"success",
                data:accept
            });
        }
        catch(error){
            next(error);
        }
    }

    async rejectFriendRequest(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.body as z.infer<typeof friendIdObj>;
            const reject=await friendService.rejectFriendRequest(userId,friendId);
            res.status(200).json({
                message:"Friend request rejected successfully",
                status:"success",
                data:reject
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFriendRequests(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const requests = await friendService.getFriendRequests(userId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Friend requests fetched successfully",
                status:"success",
                data:requests
            });
        }
        catch(error){
            next(error);
        }
    }

    async getFriendSuggestions(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const suggestions = await friendService.getFriendSuggestions(userId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Friend suggestions fetched successfully",
                status:"success",
                data:suggestions
            });
        }
        catch(error){
            next(error);
        }
    }

    async getMutualFriends(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const userId = req.user.id;
            const {friendId} = req.params as z.infer<typeof friendIdObj>;
            const {page,limit} = req.query as z.infer<typeof pageLimitObj>;
            const mutualFriends = await friendService.getMutualFriends(userId,friendId,page?parseInt(page):1,limit?parseInt(limit):10);
            res.status(200).json({
                message:"Mutual friends fetched successfully",
                status:"success",
                data:mutualFriends
            });
        }
        catch(error){
            next(error);
        }
    }

}

export const friendController = new FriendController();