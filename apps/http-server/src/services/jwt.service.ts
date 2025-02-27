import serverConfig from "../configs/server.config";
import { sign, verify, JwtPayload } from "jsonwebtoken"
import { jwt } from "@workspace/schema/jwt"
import { z } from "zod";
import { tokenRepository } from "../repositories/token.repository";
import { InternalServerError} from "../utils/errors";
import ms from "ms";

class JwtService {
    async createRefreshToken(data: z.infer<typeof jwt>) {
        try {
            const isTokenExists = await tokenRepository.getToken(data.id);

            if (isTokenExists) {
                const date = new Date();
                if (date.getTime() >= isTokenExists.expiresAt.getTime()) {
                    await tokenRepository.deleteToken(data.id);
                } else {
                    return isTokenExists.token;
                }
            }
            const token = sign(data, serverConfig.JWT_SECRET, { expiresIn: ms(serverConfig.JWT_REFRESH_EXPIRES_IN) / 1000 });
            await tokenRepository.createToken(data.id, token, ms(serverConfig.JWT_REFRESH_EXPIRES_IN));
            return token;
        } catch (error) {
            console.error(`Error in createRefreshToken Service: ${error}`);
            throw new InternalServerError();
        }
    }
    createAccessToken(data: z.infer<typeof jwt>) {
        try {
            return sign(data, serverConfig.JWT_SECRET, { expiresIn: serverConfig.JWT_ACCESS_EXPIRES_IN });
        } catch (error) {
            console.error(`Error in createAccessToken Service: ${error}`);
            throw new InternalServerError();
        }
    }

    getTokenLeftTime(token: string) {
        try {
            const decode = verify(token, serverConfig.JWT_SECRET) as JwtPayload;
            if (decode) {
                const exp = decode.exp;
                return exp ? exp * 1000 - Date.now() : 0;
            }
            return 0;
        } catch (error) {

            console.error(`Error in getTokenLeftTime Service: ${error}`);
            return 0;
        }
    }

    async createNewRefreshToken(data: z.infer<typeof jwt>) {
        try {
            const token = sign(data, serverConfig.JWT_SECRET, { expiresIn: ms(serverConfig.JWT_REFRESH_EXPIRES_IN) / 1000 });
            const isTokenExists = await tokenRepository.getToken(data.id);
            if (isTokenExists) {
                await tokenRepository.deleteToken(data.id);
            }
            await tokenRepository.createToken(data.id, token, ms(serverConfig.JWT_REFRESH_EXPIRES_IN));
            return token;
        } catch (error) {
            console.error(`Error in createNewRefreshToken Service: ${error}`);
            throw new InternalServerError();
        }
    }


}

export const jwtService = new JwtService();