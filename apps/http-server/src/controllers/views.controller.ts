import {viewsService} from "../services/views.service";
import {Response,NextFunction} from "express";
import {CustomRequest} from "../types/customRuquest";
import {postIdObj} from "@workspace/schema/views";
import {z} from "zod";

class ViewsController{
    async createView(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {postId} = req.body as z.TypeOf<typeof postIdObj>
            const views = await viewsService.createView(postId,req.user.id);
            res.status(201).json({
                message: "views created successfully",
                status: "success",
                data: views
            });
        }catch(error){
            next(error);
        }
    }
}

export const viewsController = new ViewsController();