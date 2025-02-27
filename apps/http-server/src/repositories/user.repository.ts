import {client,Prisma} from "@workspace/database/client"
import {InternalServerError,ConflictError} from "../utils/errors"
import {z} from "zod";
import { updateUser} from "@workspace/schema/user";


class UserRepository{
    async getUserByEmailOrUsernameOrMobile(data:string){
        try{
            return await client.user.findFirst({
                where: {
                    OR: [
                        {
                            email: data
                        },
                        {
                            username: data
                        },
                        {
                            mobile: data
                        }
                    ]
                }
            });
        }catch(error){
            console.error(`Error in getUserByEmailOrUsernameOrMobile Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async getUserByEmail(email:string){
        try{
            return await client.user.findFirst({
                where: {
                    email
                }
            });
        }catch(error){
            console.error(`Error in getUserByEmail Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async makeUserVerified(userId:string){
        try{
            return await client.user.update({
                where: {
                    id: userId
                },
                data: {
                    isVerified: true
                }
            });
        }catch(error){
            console.error(`Error in makeUserVerified Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async updateUser(userId:string,data:z.infer<typeof updateUser>){
        try{
            return await client.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...data
                }
            });
        }catch(error){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ConflictError('User');
                }
            }
            console.error(`Error in updateUser Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async updatePassword(userId:string,password:string){
        try{
            return await client.user.update({
                where: {
                    id: userId
                },
                data: {
                    password
                }
            });
        }catch(error){
            console.error(`Error in updatePassword Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async getUserById(userId:string){
        try{
            return await client.user.findUnique({
                where: {
                    id: userId
                }
            });
        }catch(error){
            console.error(`Error in getUserById Repository: ${error}`);
            throw new InternalServerError();
        }
    }
    async makeUserUnverified(userId:string){
        try{
            return await client.user.update({
                where: {
                    id: userId
                },
                data: {
                    isVerified: false
                }
            });
        }catch(error){
            console.error(`Error in makeUserUnverified Repository: ${error}`);
            throw new InternalServerError();
        }
    }
}

export const userRepository = new UserRepository();