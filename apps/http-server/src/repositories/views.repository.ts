import {client,Prisma} from "@workspace/database/client"
import {NotFoundError,InternalServerError} from "../utils/errors";

class ViewsRepository{

    async createView(postId:string,userId:string){
        try{
            return await client.views.create({
                data:{
                    postId,
                    userId
                }
            })
        }catch(error){
            console.error("Error creating view",error)
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2025'){
                    throw new NotFoundError('Post');
                }
                else if(error.code === 'P2016'){
                    throw new NotFoundError('User');
                }
            }
            throw new InternalServerError()
        }
    }
    async getPostViews(postId: string) {
        try {
            const views = await client.views.groupBy({
                by: ['userId'], // Group by unique userId
                where: { postId }
            });

            return views.length; // Number of unique users
        } catch (error) {
            console.error("Error getting post views", error);
            throw new InternalServerError();
        }
    }

}

export const viewsRepository = new ViewsRepository();