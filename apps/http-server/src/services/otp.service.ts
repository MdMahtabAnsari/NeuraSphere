import { otpRepository } from "../repositories/otp.repository";
import { otpEmailRequest,otpEmailVerify } from "@workspace/schema/otp";
import { AppError,InternalServerError,NotFoundError,ConflictError,UnauthorisedError } from "../utils/errors";
import { emailService } from "./email.service";
import { userRepository } from "../repositories/user.repository";
import {z} from "zod";
import { generate } from "otp-generator";
import serverConfig from "../configs/server.config";
import ms from "ms";
import { jwtService } from "./jwt.service";
import { jwt } from "@workspace/schema/jwt";
import { userGraph } from "../graph/user.graph";

class OtpService{

    async createVerifyEmailOtp(data:z.infer<typeof otpEmailRequest>){
        try{
            const user = await userRepository.getUserByEmail(data.email);
            if(!user){
                throw new NotFoundError('User');
            }
            const existingOtp = await otpRepository.getOtp({userId:user.id,type:"VerifyEmail"});
            if(existingOtp){
                if(existingOtp.expiresAt.getTime() > new Date().getTime()){
                    throw new ConflictError('Otp');
                }
                await otpRepository.deleteOtp({userId:user.id,type:"VerifyEmail"});
            }
            const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true,lowerCaseAlphabets:false });
            const expiresIn = ms(serverConfig.OTP_EXPIRES_IN);
            await otpRepository.createOtp({userId:user.id,otp,expiresIn,type:"VerifyEmail"});
            await emailService.sendMail({
                to:user.email,
                template:{
                    templateName:'otp',
                    data:{
                        name:user.name,
                        otp:otp,
                        expiresIn:parseInt(serverConfig.OTP_EXPIRES_IN)
                    }
                }
            })
            return true;
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in createOtp Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async verifyEmailOtp(data:z.infer<typeof otpEmailVerify>){
        try{
            const user = await userRepository.getUserByEmail(data.email);
            if(!user){
                throw new NotFoundError('User');
            }
            const existingOtp = await otpRepository.getOtp({userId:user.id,type:"VerifyEmail"});
            if(!existingOtp){
                throw new NotFoundError('Otp');
            }
            if(existingOtp.expiresAt.getTime() < new Date().getTime()){
                await otpRepository.deleteOtp({userId:user.id,type:"VerifyEmail"});
                throw new NotFoundError('Otp');
            }
            if(existingOtp.otp !== data.otp){
                throw new UnauthorisedError('Otp');
            }
            await otpRepository.deleteOtp({userId:user.id,type:"VerifyEmail"});
            const verifiedUser = await userRepository.makeUserVerified(user.id);
            await userGraph.updateUser(verifiedUser);
            const jwtPayload:z.infer<typeof jwt> = {
                username:user.username,
                id:user.id,
                isVerified:true,
                email:user.email
            }
            const accessToken = jwtService.createAccessToken(jwtPayload);
            const refreshToken = await jwtService.createNewRefreshToken(jwtPayload);
            return {
                accessToken,
                refreshToken
            }
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in verifyOtp Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async createForgotPasswordOtp(data:z.infer<typeof otpEmailRequest>){
        try{
            const user = await userRepository.getUserByEmail(data.email);
            if(!user){
                throw new NotFoundError('User');
            }
            const existingOtp = await otpRepository.getOtp({userId:user.id,type:"ForgotPassword"});
            if(existingOtp){
                if(existingOtp.expiresAt.getTime() > new Date().getTime()){
                    throw new ConflictError('Otp');
                }
                await otpRepository.deleteOtp({userId:user.id,type:"ForgotPassword"});
            }
            const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, digits: true,lowerCaseAlphabets:false });
            const expiresIn = ms(serverConfig.OTP_EXPIRES_IN);
            await otpRepository.createOtp({userId:user.id,otp,expiresIn,type:"ForgotPassword"});
            await emailService.sendMail({
                to:user.email,
                template:{
                    templateName:'otp',
                    data:{
                        name:user.name,
                        otp:otp,
                        expiresIn:parseInt(serverConfig.OTP_EXPIRES_IN)
                    }
                }
            })
            return true;
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in createOtp Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async verifyForgotPasswordOtp(data:z.infer<typeof otpEmailVerify>){
        try{
            const user = await userRepository.getUserByEmail(data.email);
            if(!user){
                throw new NotFoundError('User');
            }
            const existingOtp = await otpRepository.getOtp({userId:user.id,type:"ForgotPassword"});
            if(!existingOtp){
                throw new NotFoundError('Otp');
            }
            if(existingOtp.expiresAt.getTime() < new Date().getTime()){
                await otpRepository.deleteOtp({userId:user.id,type:"ForgotPassword"});
                throw new NotFoundError('Otp');
            }
            if(existingOtp.otp !== data.otp){
                throw new UnauthorisedError('Otp');
            }
            await otpRepository.deleteOtp({userId:user.id,type:"ForgotPassword"});
            const jwtPayload:z.infer<typeof jwt> = {
                username:user.username,
                id:user.id,
                isVerified:true,
                email:user.email
            }
            const accessToken = jwtService.createAccessToken(jwtPayload);
            return {accessToken}
        }catch(error){
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in verifyOtp Service: ${error}`);
            throw new InternalServerError();
        }
    }


}

export const otpService = new OtpService();