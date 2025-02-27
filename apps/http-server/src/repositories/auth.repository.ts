import {signup} from "@workspace/schema/auth";
import {client, Prisma} from "@workspace/database/client"
import {ConflictError, InternalServerError} from "../utils/errors"
import {z} from "zod";

class AuthRepository {
    async signup(data:z.infer<typeof signup>){
        try{
            const user = await client.user.create({
                data: {
                    ...data
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {password,...rest} = user;
            return rest;

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