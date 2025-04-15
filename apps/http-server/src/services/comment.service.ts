import {InternalServerError,AppError,NotFoundError,UnauthorisedError} from '../utils/errors'
import { comment, updateComment,postIdCommentIdObj } from '@workspace/schema/comment';
import {z} from 'zod'
import { commentRepository } from '../repositories/comment.repository'
import { commentRedis } from '../redis/comment.redis';
import {commentReactionService} from "./commentReaction.service";
import { notificationService } from './notification.service';
import { postRepository } from '../repositories/post.repository';
class CommentService {
    async createComment(userId:string,data: z.infer<typeof comment>) {
        try{
            const newComment = await commentRepository.createComment(userId,data)
            if(newComment){
                const cachedCount = await commentRedis.getCommentCount(data.postId)
                if(cachedCount!==null){
                    await commentRedis.incrementCommentCount(data.postId)
                }
                else{
                    const count = await commentRepository.getCommentCount({postId:data.postId})
                    await commentRedis.setCommentCount(data.postId,count)
                }
                if(newComment.parentId){
                    const parentData = await commentRepository.getCommentById(newComment.parentId);
                    if(parentData){
                        if(userId!== parentData.userId){
                            await notificationService.createNotification({
                                senderId:userId,
                                receiverId:parentData.userId,
                                postId:newComment.postId,
                                commentId:newComment.parentId,
                                type:"Reply"
                            })
                        }
                    }
                }
                else{
                    const postData = await postRepository.getPostById(newComment.postId);
                    if(postData){
                        if(postData.userId!==userId){
                            await notificationService.createNotification({
                                senderId:userId,
                                receiverId:postData.userId,
                                postId:newComment.postId,
                                commentId:newComment.id,
                                type:"Comment"
                            })
                        }
                    }
                }
            }
            return await commentRepository.getCommentById(newComment.id)
        }
        catch(error){
            if(error instanceof AppError){
                throw error
            }
            console.error("Error creating comment Service",error)
            throw new InternalServerError()
        }
    }
    async updateComment(userId:string,data: z.infer<typeof updateComment>) {
        try{
            const comment = await commentRepository.getCommentById(data.id)
            if(!comment){
                throw new NotFoundError("Comment")
            }
            if(comment.userId !== userId){
                throw new UnauthorisedError()
            }
            const updatedComment = await commentRepository.updateComment(userId,data)
            return await commentRepository.getCommentById(updatedComment.id)
        }
        catch(error){
            if(error instanceof AppError){
                throw error
            }
            console.error("Error updating comment Service",error)
            throw new InternalServerError()
        }
    }

    async deleteComment(userId:string,commentId:string) {
        try{
            const comment = await commentRepository.getCommentById(commentId)
            if(!comment){
                throw new NotFoundError("Comment")
            }
            if(comment.userId !== userId){
                throw new UnauthorisedError()
            }
            const deletedComment = await commentRepository.deleteComment(commentId)
            if(deletedComment){
                const cachedCount = await commentRedis.getCommentCount(comment.postId)
                if(cachedCount!==null){
                    await commentRedis.decrementCommentCount(comment.postId)
                }
                else{
                    const count = await commentRepository.getCommentCount({postId:comment.postId})
                    await commentRedis.setCommentCount(comment.postId,count)
                }
                await commentReactionService.removeCommentCache(comment.postId,commentId)
            }
            return true
        }
        catch(error){
            if(error instanceof AppError){
                throw error
            }
            console.error("Error deleting comment Service",error)
            throw new InternalServerError()
        }
    }

    async getComments(data:z.infer<typeof postIdCommentIdObj>,page:number=1,limit:number=10) {
        try{
            const comments = await commentRepository.getComments(data,page,limit)
            const commentsWithRepliesCount = await Promise.all(comments.map(async (comment) => {
                const repliesCount = await commentRepository.getCommentCount({postId:data.postId,commentId:comment.id})
                return {...comment,repliesCount}
            }
            ))
            const totalPage = await commentRepository.getCommentPages(data,limit)
            return {comments:commentsWithRepliesCount,totalPage,currentPage:page}
        }
        catch(error){
            if(error instanceof AppError){
                throw error
            }
            console.error("Error getting comments Service",error)
            throw new InternalServerError()
        }
    }

    async getPostCommentsCount(postId:string) {
        try{
            const count = await commentRedis.getCommentCount(postId)
            if(count!==null){
                return count
            }
            else{
                const newCount = await commentRepository.getCommentCount({postId})
                await commentRedis.setCommentCount(postId,newCount)
                return newCount
            }
        }
        catch(error){
            console.error("Error getting post comments count Service",error)
            throw new InternalServerError()
        }
    }

    async removeCache(postId:string){
        try{
            await commentRedis.deleteCommentCount(postId);
        }catch(error){
            console.error("Error to remove cache service",error);
            throw new InternalServerError()
        }
    }

}

export const commentService = new CommentService()

