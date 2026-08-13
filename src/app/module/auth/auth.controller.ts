import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

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

export const AuthController = {
    registerPatient,
    loginUser,
};