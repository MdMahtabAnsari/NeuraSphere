import {InternalServerError, NotFoundError} from '../utils/errors/index'
import {client, Prisma} from '@workspace/database/client'
import {comment, postIdCommentIdObj, updateComment} from '@workspace/schema/comment'
import {z} from 'zod'

class CommentRepository {

    async createComment(userId:string,data: z.infer<typeof comment>) {
        try{
            return await client.comments.create({
                data: {
                    postId: data.postId,
                    content: data.content,
                    parentId: data.parentId,
                    userId: userId
                }
            })
        }
        catch(error){
            console.error("Error creating comment Repository",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError("Post")
                }
                else if(error.code === 'P2014'){
                    throw new NotFoundError("Parent comment")
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError("User")
                }
            }
            throw new InternalServerError()
        }
    }

    async getCommentById(commentId:string) {
        try{
            return await client.comments.findUnique({
                where:{
                    id:commentId
                },
                select:{
                    id:true,
                    postId:true,
                    parentId:true,
                    content:true,
                    userId:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            image:true
                        }
                    },
                    isEdited:true,
                    createdAt:true,
                    updatedAt:true,
                }
            })
        }
        catch(error){
            console.error("Error getting comment Repository",error)
            throw new InternalServerError()
        }
    }

    async updateComment(userId:string,data: z.infer<typeof updateComment>) {
        try{

            return await client.comments.update({
                where: {
                    id: data.id
                },
                data: {
                    content: data.content,
                    isEdited: true
                }
            })
        }
        catch(error){
            console.error("Error updating comment Repository",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2014'){
                    throw new NotFoundError("Comment")
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError("User")
                }
                else if(error.code === 'P2025'){
                    throw new NotFoundError("Post")
                }
            }
            throw new InternalServerError()
        }
    }

    async deleteComment(commentId:string) {
        try{
            return await client.comments.delete({
                where:{
                    id:commentId
                }
            });
        }catch(error){
            console.error("Error deleting comment Repository",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2014'){
                    throw new NotFoundError("Comment")
                }
            }
            throw new InternalServerError()
        }
    }

    async getComments(data:z.infer<typeof postIdCommentIdObj>,page:number=1,limit:number=10) {
        try{
            const skip = (page-1)*limit
            return await client.comments.findMany({
                where:{
                    postId:data.postId,
                    parentId:data.commentId
                },
                skip,
                take:limit,
                orderBy:{
                    createdAt:'asc'
                },
                select:{
                    id:true,
                    postId:true,
                    parentId:true,
                    content:true,
                    userId:true,
                    user:{
                        select:{
                            id:true,
                            name:true,
                            image:true
                        }
                    },
                    isEdited:true,
                    createdAt:true,
                    updatedAt:true,
                },
            })
        }
        catch(error){
            console.error("Error getting comments Repository",error)
            throw new InternalServerError()
        }
    }
    async getCommentPages(data:z.infer<typeof postIdCommentIdObj>,limit:number=10) {
        try{
            const count = await client.comments.count({
                where:{
                    postId:data.postId,
                    parentId:data.commentId
                }
            })
            return Math.ceil(count/limit)
        }
        catch(error){
            console.error("Error getting comment pages Repository",error)
            throw new InternalServerError()
        }
    }

    async getCommentCount(data:z.infer<typeof postIdCommentIdObj>) {
        try{
            return await client.comments.count({
                where:{
                    postId:data.postId,
                    parentId:data.commentId
                }
            })
        }
        catch(error){
            console.error("Error getting comment count Repository",error)
            throw new InternalServerError()
        }
    }

}

export const commentRepository = new CommentRepository()