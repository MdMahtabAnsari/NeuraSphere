import {signup} from "@workspace/schema/auth";
import {client, Prisma} from "@workspace/database/client"
import {ConflictError, InternalServerError} from "../utils/errors"
import {z} from "zod";

class AuthRepository {
    async signup(data:z.infer<typeof signup>){
        try{
            return await client.user.create({
                data: {
                    ...data
                }
            });

        }catch(error){
            console.error(`Error in signup Repository: ${error}`);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ConflictError('User already exists');
                }
            }
            throw new InternalServerError();
        }
    }

}

export const authRepository = new AuthRepository();