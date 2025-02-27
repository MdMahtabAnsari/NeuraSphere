import { otpService } from "../services/otp.service";
import { Request, Response, NextFunction } from "express";
import { jwtService } from "../services/jwt.service";
import { cookieConfigGenerator } from "../configs/cookie.config";
import { otpEmailRequest, otpEmailVerify } from "@workspace/schema/otp";
import {z} from "zod";
class OtpController {
    async createVerifyEmailOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof otpEmailRequest> = {
                email: req.body.email,
            };
            await otpService.createVerifyEmailOtp(data);
            res.status(200).json({
                message: "Otp sent successfully",
                status: "success",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof otpEmailVerify> = {
                email: req.body.email,
                otp: req.body.otp
            };
            const { accessToken, refreshToken } = await otpService.verifyEmailOtp(data);
            const accessTokenExpiry = jwtService.getTokenLeftTime(accessToken);
            const refreshTokenExpiry = jwtService.getTokenLeftTime(refreshToken);
            res.cookie('accessToken', accessToken, cookieConfigGenerator({ type: "accessToken", sameSite: "strict", expiresIn: accessTokenExpiry })).cookie('refreshToken', refreshToken, cookieConfigGenerator({ type: "refreshToken", sameSite: "strict", expiresIn: refreshTokenExpiry })).json({
                message: "Email verified successfully",
                status: "success",
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    async createForgotPasswordOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof otpEmailRequest> = {
                email: req.body.email,
            };
            await otpService.createForgotPasswordOtp(data);
            res.status(200).json({
                message: "Otp sent successfully",
                status: "success",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyForgotPasswordOtp(req: Request, res: Response, next: NextFunction) {
        try{
            const data: z.infer<typeof otpEmailVerify> = {
                email: req.body.email,
                otp: req.body.otp
            };
            const {accessToken} = await otpService.verifyForgotPasswordOtp(data);
            const accessTokenExpiry = jwtService.getTokenLeftTime(accessToken);
            res.cookie('accessToken',accessToken,cookieConfigGenerator({type:"accessToken",sameSite:"strict",expiresIn:accessTokenExpiry})).json({
                message:"Otp verified successfully",
                status:"success",
                data:null,
            });
        }
        catch(error){
            next(error);
        }
    }

}

export const otpController = new OtpController();