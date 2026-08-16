import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

/**
 * Controller to handle Patient registration.
 * Calls `AuthService.registerPatient`, sets authentication & session cookies,
 * and returns the created patient along with tokens.
 *
 * @route POST /api/v1/auth/register
 * @access Public
 */
const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.registerPatient(payload);
        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    }
);

/**
 * Controller to handle User authentication (Login).
 * Calls `AuthService.loginUser`, sets authentication & session cookies,
 * and returns user tokens and session data.
 *
 * @route POST /api/v1/auth/login
 * @access Public
 */
const loginUser = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await AuthService.loginUser(payload);
        const { accessToken, refreshToken, token, ...rest } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest,
            },
        });
    }
);

const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const result = await AuthService.getMe(user);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User fetched successfully",
            data: result,
        });
    }
);


const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const betterAuthSessionToken =
            req.cookies["better-auth-session"] ||
            req.cookies["better-auth.session_token"] ||
            req.cookies["better-auth-session-token"] ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization);

        if (!refreshToken || !betterAuthSessionToken) {
            throw new AppError(status.BAD_REQUEST, "No refresh token or session token found");
        }
        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, newRefreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "New token generated successfully",
            data: {
                sessionToken,
                accessToken,
                refreshToken: newRefreshToken,
            },
        });
    }
);

const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const betterAuthSessionToken =
            req.cookies["better-auth-session"] ||
            req.cookies["better-auth.session_token"] ||
            req.cookies["better-auth-session-token"] ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization);

        if (!betterAuthSessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No session token provided.");
        }

        const result = await AuthService.chnagePassword(payload, betterAuthSessionToken);

        const {accessToken,refreshToken,token}=result;

        tokenUtils.storeTokenIntoCookie(res, accessToken);
        tokenUtils.storeRefreshTokenIntoCookie(res, refreshToken);
        tokenUtils.setBetterAuthSessionCookie(res, token as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result,
        });
    }
);

export const AuthController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword
};
