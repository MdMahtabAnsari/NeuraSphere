import {authService} from "../services/auth.service";
import {Request,Response,NextFunction} from "express";
import {cookieConfigGenerator} from "../configs/cookie.config";
import {jwtService} from "../services/jwt.service";
import { CustomRequest } from "../types/customRuquest";
import { signup,login } from "@workspace/schema/auth";
import {z} from "zod"
import { userService } from "../services/user.service";
import {updateUserOtpBasedPassword} from "@workspace/schema/user";

class AuthController{
    async signup(req:Request,res:Response,next:NextFunction){
        try{
            const data:z.infer<typeof signup> = {
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                dob:req.body.dob,
                name:req.body.name,
                mobile:req.body.mobile,
                bio:req.body.bio,
                image:req.body.image,
            };
            const user = await authService.signup(data);
            res.status(201).json({
                message:"User created successfully",
                status:"success",
                data:user
            });
        }catch(error){
            next(error);
        }
    }

    async login(req:Request,res:Response,next:NextFunction){
        try{
            const data:z.infer<typeof login> = {
                identifier:req.body.identifier,
                password:req.body.password
            };
            const {accessToken,refreshToken} = await authService.login(data);
            const accessTokenExpiry = jwtService.getTokenLeftTime(accessToken);
            const refreshTokenExpiry = jwtService.getTokenLeftTime(refreshToken);
            res.cookie('accessToken',accessToken,cookieConfigGenerator({type:"accessToken",sameSite:"strict",expiresIn:accessTokenExpiry})).cookie('refreshToken',refreshToken,cookieConfigGenerator({type:"refreshToken",sameSite:"strict",expiresIn:refreshTokenExpiry})).json({
                message:"Login successful",
                status:"success",
                data:null,
            });
        }catch(error){
            next(error);
        }
    }

    async refresh(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const {accessToken,refreshToken} = await authService.refresh(req.user);
            const accessTokenExpiry = jwtService.getTokenLeftTime(accessToken);
            const refreshTokenExpiry = jwtService.getTokenLeftTime(refreshToken);
            res.cookie('accessToken',accessToken,cookieConfigGenerator({type:"accessToken",sameSite:"strict",expiresIn:accessTokenExpiry})).cookie('refreshToken',refreshToken,cookieConfigGenerator({type:"refreshToken",sameSite:"strict",expiresIn:refreshTokenExpiry})).json({
                message:"Refresh successful",
                status:"success",
                data:null,
            });
        }catch(error){
            next(error);
        }
    }

    async updateUserOtpBasedPassword(req:CustomRequest,res:Response,next:NextFunction){
        try{
            const data:z.infer<typeof updateUserOtpBasedPassword> = {
                newPassword:req.body.newPassword
            };
            await userService.updateUserOtpBasedPassword(req.user.id,data.newPassword);
            res.clearCookie('accessToken').clearCookie('refreshToken').status(200).json({
                message:"Password updated successfully",
                status:"success",
                data:null,
            });
        }catch(error){
            next(error);
        }
    }
}

export const authController = new AuthController();