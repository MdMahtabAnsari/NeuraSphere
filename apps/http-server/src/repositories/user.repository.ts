import {client,Prisma} from "@workspace/database/client"
import {InternalServerError,ConflictError} from "../utils/errors"
import {z} from "zod";
import { updateUser} from "@workspace/schema/user";


class UserRepository{
    async getUserByEmailOrUsernameOrMobileOrId(data:string){
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
                        },{
                            id: data
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

    async getUsresbyNameOrUsernameOrEmailOrMobile(data:string,page:number=1,limit:number=10){
        try{
            return await client.user.findMany({
                where: {
                    OR: [
                        {
                            email: {
                                contains: data
                            }
                        },
                        {
                            username: {
                                contains: data
                            }
                        },
                        {
                            name: {
                                contains: data
                            }
                        },
                        {
                            mobile: {
                                contains: data
                            }
                        }
                    ]
                },
                skip: (page-1)*limit,
                take: limit
            });
        }catch(error){
            console.error(`Error in getUsresbyNameOrUsernameOrEmailOrMobile Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async getUsresbyNameOrUsernameOrEmailOrMobilePageCount(data:string,limit:number=10){
        try{
            const count = await client.user.count({
                where: {
                    OR: [
                        {
                            email: {
                                contains: data
                            }
                        },
                        {
                            username: {
                                contains: data
                            }
                        },
                        {
                            name: {
                                contains: data
                            }
                        },
                        {
                            mobile: {
                                contains: data
                            }
                        }
                    ]
                }
            });
            return Math.ceil(count/limit);
        }catch(error){
            console.error(`Error in getUsresbyNameOrUsernameOrEmailOrMobilePageCount Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async isUsernameAvailable(username:string){
        try{
            const user = await client.user.findFirst({
                where: {
                    username
                }
            });
            return !user;
        }catch(error){
            console.error(`Error in isUsernameAvailable Repository: ${error}`);
            throw new InternalServerError();
        }
    }
    async isEmailAvailable(email:string){
        try{
            const user = await client.user.findFirst({
                where: {
                    email
                }
            });
            return !user;
        }catch(error){
            console.error(`Error in isEmailAvailable Repository: ${error}`);
            throw new InternalServerError();
        }
    }
    async isMobileAvailable(mobile:string){
        try{
            const user = await client.user.findFirst({
                where: {
                    mobile
                }
            });
            return !user;
        }catch(error){
            console.error(`Error in isMobileAvailable Repository: ${error}`);
            throw new InternalServerError();
        }
    }

    async isValidEmail(email:string){
        try{
            const user = await client.user.findFirst({
                where: {
                    email
                }
            });
            return !!user;
        }catch(error){
            console.error(`Error in isValidEmail Repository: ${error}`);
            throw new InternalServerError();
        }
    }
}

export const userRepository = new UserRepository();