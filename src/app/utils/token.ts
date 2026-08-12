import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwtUtils from "./jwt";
import { envVars } from "../../config/env";
import cookieUtils from "./cookie";
import ms from "ms"
import { Response } from "express";

const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions)
    return accessToken;
}
const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions)
    return refreshToken;
}


const storeTokenIntoCookie = (res: Response, token: string) => {
    const maxAge = ms(Number(envVars.ACCESS_TOKEN_EXPIRES_IN));
    cookieUtils.setCookie(res, 'access token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge: Number(maxAge)
    })
}


const storeRefreshTokenIntoCookie = (res: Response, refreshToken: string) => {
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN))
    cookieUtils.setCookie(res, 'refresh token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/',
        maxAge: Number(maxAge)
    })
}



const setBetterAuthSessionCookie = (res: Response, token: string) => {
    const maxAge = ms(Number(envVars.REFRESH_TOKEN_EXPIRES_IN))
    cookieUtils.setCookie(res, 'batter-auth-session', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: Number(maxAge)
    })

}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    storeTokenIntoCookie,
    storeRefreshTokenIntoCookie,
    setBetterAuthSessionCookie
}