import { BadRequestError,InternalServerError } from "../utils/errors";
import {client,Prisma} from "@workspace/database/client";

interface OtpType{
    userId:string,
    otp:string,
    expiresIn:number,
    type:"Login"|"ForgotPassword"|"VerifyEmail"|"VerifyMobile"
}

interface OtpOprType{
    userId:string,
    type:"Login"|"ForgotPassword"|"VerifyEmail"|"VerifyMobile"
}


class OtpRepository{

    async createOtp(date:OtpType){
        try{
            return await client.otp.create({
                data: {
                    userId: date.userId,
                    otp: date.otp,
                    expiresAt: new Date(Date.now() + date.expiresIn),
                    type: date.type
                }
            });
        }catch(error){
            console.error(`Error in createOtp Respository: ${error}`);
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new BadRequestError('Otp already exists');
                }
            }
            throw new InternalServerError();
        }
    }

    async getOtp(data:OtpOprType){
        try{
            return await client.otp.findFirst({
                where: {
                    userId:data.userId,
                    type:data.type
                }
            });
        }catch(error){
            console.error(`Error in getOtp Respository: ${error}`);
            throw new InternalServerError();
        }
    }

    async deleteOtp(data:OtpOprType){
        try{
            return await client.otp.delete({
                where: {
                    userId:data.userId,
                    type:data.type
                }
            });
        }catch(error){
            console.error(`Error in deleteOtp Respository: ${error}`);
            throw new InternalServerError();
        }
    }
}

export const otpRepository = new OtpRepository();