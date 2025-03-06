import { commentService } from "../services/comment.service";
import {Request,Response,NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import { comment,updateComment,id,getComments } from "@workspace/schema/comment";
import {z} from 'zod'


class CommentController {
    async createComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof comment> = {
                postId: req.body.postId,
                content: req.body.content,
                parentId: req.body.parentId
            }
            const newComment = await commentService.createComment(req.user.id,data)
            res.status(201).json({
                message: "Comment created successfully",
                status: "success",
                data: newComment
            })
        }
        catch(error){
            next(error)
        }
    }

    async updateComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof updateComment> = {
                id: req.body.id,
                content: req.body.content
            }
            const updatedComment = await commentService.updateComment(req.user.id,data)
            res.status(200).json({
                message: "Comment updated successfully",
                status: "success",
                data: updatedComment
            })
        }
        catch(error){
            next(error)
        }
    }

    async deleteComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const commentId = req.params.id as z.infer<typeof id>
            await commentService.deleteComment(req.user.id,commentId)
            res.status(200).json({
                message: "Comment deleted successfully",
                status: "success"
            })
        }
        catch(error){
            next(error)
        }
    }

    async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const {postId,commentId,page,limit} = req.query as z.infer<typeof getComments>
            const comments = await commentService.getComments({postId,commentId},page?parseInt(page):1,limit?parseInt(limit):10)
            res.status(200).json({
                message: "Comments fetched successfully",
                status: "success",
                data: comments
            })
        }
        catch(error){
            next(error)
        }
    }
}

export const commentController = new CommentController()