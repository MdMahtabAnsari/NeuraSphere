import {ConflictError, InternalServerError, NotFoundError} from "../utils/errors";
import {client, Prisma} from '@workspace/database/client'

class CommentReactionRepository{
    async likeComment(commentId:string,userId:string){
        try{
            console.log("userId",userId)
            const isDisliked = await client.comment_Reaction.findFirst({
                where:{
                    commentId,
                    userId,
                    type:'Dislike'
                }
            }
            )
            let isDislikedStatus = false
            if(isDisliked){
                await client.comment_Reaction.delete({
                    where:{
                        commentId_userId:{
                            commentId,
                            userId
                        },
                        type:"Dislike"
                    }
                })
                isDislikedStatus = true
            }
            const like = await client.comment_Reaction.create({
                data:{
                    commentId,
                    userId,
                    type:'Like'
                }
            })
            return {isDisliked:isDislikedStatus,like}
        }catch(error){
            console.error("Error liking comment",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError('Comment');
                }
                else if(error.code === 'P2002'){
                    throw new ConflictError('like');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }

            }
            throw new InternalServerError()
        }
    }

    async dislikeComment(commentId:string,userId:string){
        try{
            const isLiked = await client.comment_Reaction.findFirst({
                where:{
                    commentId,
                    userId,
                    type:'Like'
                }
            }
            )
            let isLikedStatus = false
            if(isLiked){
                await client.comment_Reaction.delete({
                    where:{
                        commentId_userId:{
                            commentId,
                            userId
                        },
                        type:"Like"
                    }
                })
                isLikedStatus = true
            }
            const dislike = await client.comment_Reaction.create({
                data:{
                    commentId,
                    userId,
                    type:'Dislike'
                }
            })
            return {isLiked:isLikedStatus,dislike}
        }catch(error){
            console.error("Error disliking comment",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError('Comment');
                }
                else if(error.code === 'P2002'){
                    throw new ConflictError('dislike');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError()
        }
    }

    async unlikeComment(commentId:string,userId:string){
        try{
            return await client.comment_Reaction.delete({
                where: {
                    commentId_userId: {
                        commentId,
                        userId
                    },
                    type: "Like"
                }
            })
        }catch(error){
            console.error("Error unliking comment",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError('Comment');
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError('Like');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError()
        }
    }

    async removeDislikeComment(commentId:string,userId:string){
        try{
            return await client.comment_Reaction.delete({
                where: {
                    commentId_userId: {
                        commentId,
                        userId
                    },
                    type: "Dislike"
                }
            })
        }catch(error){
            console.error("Error removing dislike from comment",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError('Comment');
                }
                else if(error.code === 'P2002'){
                    throw new NotFoundError('Dislike');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError()
        }
    }

    async getCommentLikeCount(commentId:string){
        try{
            return await client.comment_Reaction.count({
                where: {
                    commentId,
                    type: "Like"
                }
            })
        }catch(error){
            console.error("Error getting comment like count",error)
            throw new InternalServerError()
        }
    }

    async getCommentDislikeCount(commentId:string){
        try{
            return await client.comment_Reaction.count({
                where: {
                    commentId,
                    type: 'Dislike'
                }
            })
        }catch(error){
            console.error("Error getting comment dislike count",error)
            throw new InternalServerError()
        }
    }

    async getCommentReactionStatus(commentId:string,userId:string){
        try{
            const reaction = await client.comment_Reaction.findFirst({
                where:{
                    commentId,
                    userId
                }
            })
            if (reaction) {
                return reaction.type === 'Like' ? { like: true, dislike: false } : { like: false, dislike: true };
            }
            return { like: false, dislike: false };
        }catch(error){
            console.error('Error getting user reaction status from database', error);
            return null;
        }
    }

    async likedUsers(commentId:string,page:number=1,limit:number=10){
        try{
            return await client.comment_Reaction.findMany({
                where: {
                    commentId,
                    type: 'Like'
                },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    commentId: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                },
            })
        }catch(error){
            console.error("Error getting liked users",error)
            throw new InternalServerError()
        }
    }

    async dislikedUsers(commentId:string,page:number=1,limit:number=10){
        try{
            return await client.comment_Reaction.findMany({
                where: {
                    commentId,
                    type: 'Dislike'
                },
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    commentId: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                },
            })
        }catch(error){
            console.error("Error getting disliked users",error)
            throw new InternalServerError()
        }
    }

    async getLikeUsersPages(commentId:string,limit:number=10){
        try{
            const count = await client.comment_Reaction.count({
                where:{
                    commentId,
                    type:'Like'
                }
            })
            return Math.ceil(count/limit)
        }catch(error){
            console.error("Error getting like users pages",error)
            throw new InternalServerError()
        }
    }

    async getDislikeUsersPages(commentId:string,limit:number=10){
        try{
            const count = await client.comment_Reaction.count({
                where:{
                    commentId,
                    type:'Dislike'
                }
            })
            return Math.ceil(count/limit)
        }catch(error){
            console.error("Error getting dislike users pages",error)
            throw new InternalServerError()
        }
    }

}

export const commentReactionRepository = new CommentReactionRepository()