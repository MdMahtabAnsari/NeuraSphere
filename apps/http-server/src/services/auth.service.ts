import {authRepository} from "../repositories/auth.repository";
import {TSignup} from "@workspace/schema/schemas";
import {AppError,InternalServerError} from "@workspace/backend-common/errors";
import {hash} from "argon2"

class AuthService{
    async signup(data:TSignup){
        try{
            data.password = await hash(data.password);
            return await authRepository.signup(data);
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            throw new InternalServerError();
        }
    }
}

export const authService = new AuthService();