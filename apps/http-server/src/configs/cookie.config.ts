import serverConfig from "./server.config";
import { CookieOptions } from "express";

interface CookieConfig {
    type:'refreshToken'|'accessToken',
    sameSite:'strict'|'lax'|'none',
    expiresIn:number
}

export const cookieConfigGenerator = (config:CookieConfig)=>{

    if(serverConfig.NODE_ENV === 'development'){
        return {
            httpOnly:true,
            secure:false,
            expires:new Date(Date.now() + config.expiresIn),
        } as CookieOptions;
    }
    else{
        return {
            httpOnly:true,
            secure:true,
            sameSite:config.sameSite,
            expires:new Date(Date.now() + config.expiresIn),
        } as CookieOptions;
    }
}