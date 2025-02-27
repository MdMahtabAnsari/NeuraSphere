import passport from "passport";

const sessionConfig = {
    session: false
}

export const accessTokenValidator = () => {
    return passport.authenticate("access-token", sessionConfig);
}

export const refreshTokenValidator = () => {
    return passport.authenticate("refresh-token", sessionConfig);
}