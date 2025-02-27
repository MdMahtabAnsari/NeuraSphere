import { Strategy, ExtractJwt, VerifiedCallback } from "passport-jwt"
import passport from "passport"
import serverConfig from "../configs/server.config"
import { jwt } from "@workspace/schema/jwt"
import { z } from "zod"
import { Request } from "express"
import { UnauthorisedError } from "../utils/errors"

passport.use("access-token", new Strategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
            return req.cookies?.accessToken
        }
    ]),
    secretOrKey: serverConfig.JWT_SECRET
}, (payload: z.infer<typeof jwt>, done: VerifiedCallback) => {
    try {
        if (payload) {
            return done(null, payload);
        }
        return done(new UnauthorisedError(), false);
    } catch (error) {
        return done(error, false);
    }
}))


passport.use("refresh-token", new Strategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
            return req.cookies?.refreshToken
        }
    ]),
    secretOrKey: serverConfig.JWT_SECRET
}, (payload: z.infer<typeof jwt>, done: VerifiedCallback) => {
    try {
        if (payload) {
            return done(null, payload);
        }
        return done(new UnauthorisedError(), false);
    } catch (error) {
        return done(error, false);
    }
}))


