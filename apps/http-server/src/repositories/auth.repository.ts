import {TSignup} from "@workspace/schema/schemas"
import {client,Prisma} from "@workspace/database/client"
import {ConflictError,InternalServerError} from "@workspace/backend-common/errors"

class AuthRepository {
    async signup(data:TSignup){
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