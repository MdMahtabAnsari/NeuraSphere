import {authService} from "../services/auth.service";
import {Request,Response,NextFunction} from "express";
import {signup} from "@workspace/schema/schemas"
import {BadRequestError} from "@workspace/backend-common/errors"

class AuthController{
    async signup(req:Request,res:Response,next:NextFunction){
        try{
            const isValidBody = signup.safeParse(req.body);
            if(!isValidBody.success){
                next(new BadRequestError(isValidBody.error.message.toString()));
            }
            const user = await authService.signup(req.body);
            res.status(201).json({
                message:"User created successfully",
                status:"success",
                data:user
            });
        }catch(error){
            next(error);
        }
    }
}

export const authController = new AuthController();