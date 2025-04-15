import { userService } from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/customRuquest";
import { cookieConfigGenerator } from "../configs/cookie.config";
import { jwtService } from "../services/jwt.service";
import { updateUser, updateUserOldPassword, identifierObj, pageLimitObj, usernameObj, emailObj, mobileObj } from '@workspace/schema/user';
import { z } from "zod";
import { paramsValidator } from '../validators/params.validator';


class UserController {
    async updateUser(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof updateUser> = {
                username: req.body.username,
                email: req.body.email,
                name: req.body.name,
                mobile: req.body.mobile,
                bio: req.body.bio,
                image: req.body.image,
                dob: req.body.dob,
            };
            const { user, token } = await userService.updateUser(req.user.id, data);
            const accessTokenExpiry = jwtService.getTokenLeftTime(token.accessToken);
            const refreshTokenExpiry = jwtService.getTokenLeftTime(token.refreshToken);
            res.cookie('accessToken', token.accessToken, cookieConfigGenerator({ type: "accessToken", sameSite: "strict", expiresIn: accessTokenExpiry })).cookie('refreshToken', token.refreshToken, cookieConfigGenerator({ type: "refreshToken", sameSite: "strict", expiresIn: refreshTokenExpiry })).json({
                message: "User updated successfully",
                status: "success",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUserOldPassword(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const data: z.infer<typeof updateUserOldPassword> = {
                oldPassword: req.body.oldPassword,
                newPassword: req.body.newPassword
            };
            await userService.updateUserOldPassword(req.user.id, data);
            res.status(200).json({
                message: "Password updated successfully",
                status: "success",
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { identifier } = req.params as z.infer<typeof identifierObj>;
            const user = await userService.getProfile(req.user.id, identifier);
            res.status(200).json({
                message: "User fetched successfully",
                status: "success",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { identifier } = req.params as z.infer<typeof identifierObj>;
            const { page, limit } = req.query as z.infer<typeof pageLimitObj>;
            const users = await userService.getUsers(identifier, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10);
            res.status(200).json({
                message: "Users fetched successfully",
                status: "success",
                data: users
            });
        } catch (error) {
            next(error);
        }
    }
    async isUsernameAvailable(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.params as z.infer<typeof usernameObj>;
            const isAvailable = await userService.isUsernameAvailable(username);
            res.status(200).json({
                message: "Username availability fetched successfully",
                status: "success",
                data: isAvailable
            });
        } catch (error) {
            next(error);
        }
    }
    async isEmailAvailable(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params as z.infer<typeof emailObj>;
            const isAvailable = await userService.isEmailAvailable(email);
            res.status(200).json({
                message: "Email availability fetched successfully",
                status: "success",
                data: isAvailable
            });
        } catch (error) {
            next(error);
        }
    }
    async isMobileAvailable(req: Request, res: Response, next: NextFunction) {
        try {
            const { mobile } = req.params as z.infer<typeof mobileObj>;
            const isAvailable = await userService.isMobileAvailable(mobile);
            res.status(200).json({
                message: "Mobile availability fetched successfully",
                status: "success",
                data: isAvailable
            });
        } catch (error) {
            next(error);
        }
    }

    async isValidEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.params as z.infer<typeof emailObj>;
            const isValid = await userService.isValidEmail(email);
            res.status(200).json({
                message: "Email validity fetched successfully",
                status: "success",
                data: isValid
            });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();