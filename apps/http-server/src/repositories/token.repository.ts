import { InternalServerError } from "../utils/errors";
import { client } from "@workspace/database/client";


class TokenRepository {
    async getToken(userId: string) {
        try {
            return await client.token.findFirst({
                where: {
                    userId
                }
            });
        } catch (error) {
            console.error(`Error in getToken Respository: ${error}`);
            throw new InternalServerError();
        }
    }

    async deleteToken(userId: string) {
        try {
            return await client.token.delete({
                where: {
                    userId
                }
            });
        } catch (error) {
            console.error(`Error in deleteToken Respository: ${error}`);
            throw new InternalServerError();
        }
    }
    async createToken(userId: string, token: string, expiresIn: number) {
        try {
            return await client.token.create({
                data: {
                    userId,
                    token,
                    expiresAt: new Date(Date.now() + expiresIn)
                }
            });
        } catch (error) {
            console.error(`Error in createToken Respository: ${error}`);
            throw new InternalServerError();
        }
    }
}

export const tokenRepository = new TokenRepository();