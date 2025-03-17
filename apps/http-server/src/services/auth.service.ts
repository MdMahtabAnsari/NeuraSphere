import {authRepository} from "../repositories/auth.repository";
import {signup,login} from "@workspace/schema/auth";
import {z} from "zod";
import {AppError,InternalServerError,NotFoundError,UnauthorisedError,BadRequestError} from "../utils/errors";
import {hash,verify} from "argon2"
import {jwtService} from "./jwt.service";
import {jwt} from "@workspace/schema/jwt";
import { userRepository } from "../repositories/user.repository";
import { userGraph } from "../graph/user.graph";

class AuthService{
    async signup(data:z.infer<typeof signup>){
        try{
            data.password = await hash(data.password);
            data.dob = new Date(data.dob);
            const signupData = await authRepository.signup(data);
            if(signupData){
                await userGraph.createUser(signupData);
            }
            const {password,...user} = signupData;
            return user;
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in signup Service: ${error}`);
            throw new InternalServerError();
        }
    }
    async login(data:z.infer<typeof login>){
        try{
            const user = await userRepository.getUserByEmailOrUsernameOrMobile(data.identifier);
            if(!user){
                throw new NotFoundError('User');
            }
            if(!user.password){
                throw new BadRequestError('User has no password');
            }
            const valid = await verify(user.password,data.password);
            if(!valid){
                throw new UnauthorisedError('Invalid password');
            }
            const jwtPayload:z.infer<typeof jwt> = {
                username:user.username,
                id:user.id,
                isVerified:user.isVerified,
                email:user.email
            }
            const accessToken = jwtService.createAccessToken(jwtPayload);
            const refreshToken = await jwtService.createRefreshToken(jwtPayload);
            return {
                accessToken,
                refreshToken
            }
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in login Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async refresh(userId: string){
        try{
            const user = await userRepository.getUserById(userId);
            if(!user){
                throw new NotFoundError('User');
            }
            const jwtPayload:z.infer<typeof jwt> = {
                username:user.username,
                id:user.id,
                isVerified:user.isVerified,
                email:user.email
            }
            const accessToken = jwtService.createAccessToken(jwtPayload);
            const refreshToken = await jwtService.createRefreshToken(jwtPayload);
            return {
                accessToken,
                refreshToken
            }
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in refresh Service: ${error}`);
            throw new InternalServerError();
        }
    }

}

export const authService = new AuthService();