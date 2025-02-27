import { AppError, InternalServerError, BadRequestError, NotFoundError, UnauthorisedError } from "../utils/errors";
import { updateUser } from "@workspace/schema/user";
import { z } from "zod";
import { userRepository } from "../repositories/user.repository";
import { jwtService } from "./jwt.service";
import { jwt } from "@workspace/schema/jwt";
import { updateUserOldPassword } from "@workspace/schema/user"
import { verify, hash } from "argon2";

class UserService {

    async updateUser(userId: string, data: z.infer<typeof updateUser>) {
        try {
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new NotFoundError('User');
            }
            const updateUser = await userRepository.updateUser(userId, data);
            let jwtPayload: z.infer<typeof jwt>
            if (updateUser.email !== user.email) {
                await userRepository.makeUserUnverified(updateUser.id);
                jwtPayload = {
                    username: updateUser.username,
                    id: updateUser.id,
                    isVerified: false,
                    email: updateUser.email
                }
            }
            else {
                jwtPayload = {
                    username: updateUser.username,
                    id: updateUser.id,
                    isVerified: updateUser.isVerified,
                    email: updateUser.email
                }
            }
            const accesToken = jwtService.createAccessToken(jwtPayload);
            const refreshToken = await jwtService.createNewRefreshToken(jwtPayload);
            const { password, ...userWithoutPassword } = updateUser;
            return { user: userWithoutPassword, token: { accessToken: accesToken, refreshToken } };

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error(`Error in updateUser Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async updateUserOldPassword(userId: string, data: z.infer<typeof updateUserOldPassword>) {
        try {
            if (data.newPassword === data.oldPassword) {
                throw new BadRequestError('New password should not be same as old password');
            }
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new NotFoundError('User');
            }
            if (!user.password) {
                throw new BadRequestError('User has no password');
            }
            const valid = await verify(user.password, data.oldPassword);
            if (!valid) {
                throw new UnauthorisedError('Invalid password');
            }
            const newPassword = await hash(data.newPassword);
            await userRepository.updatePassword(userId, newPassword);
            return true;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error(`Error in updateUserOldPassword Service: ${error}`);
            throw new InternalServerError();
        }
    }

    async updateUserOtpBasedPassword(userId: string, password: string) {
        try {
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new NotFoundError('User');
            }
            if (user.password) {
                const isMatch = await verify(user.password, password);
                if (isMatch) {
                    throw new BadRequestError('New password should not be same as old password');
                }
            }
            const newPassword = await hash(password);
            await userRepository.updatePassword(user.id, newPassword);
            return true;
        } catch (error) {
            if(error instanceof AppError){
                throw error;
            }
            console.error(`Error in updateUserOtpBasedPassword Service: ${error}`);
            throw new InternalServerError();
        }
    }

}

export const userService = new UserService();