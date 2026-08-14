import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserServices } from "./user.service";
import { Request, Response } from "express";
import status from "http-status";

/**
 * Controller to handle the creation of a new Doctor account alongside user credentials and specialties.
 * Passes the request body payload to `UserServices.createDoctor` and sends a 201 Created response.
 *
 * @route POST /api/v1/user/create-doctor
 * @access Admin / Authorized Roles
 */
const createDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await UserServices.createDoctor(payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Doctor created successfully",
            data: result,
        });
    }
);

const createAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await UserServices.createAdmin(payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Admin created successfully",
            data: result,
        });
    }
);

const createSuperAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await UserServices.createSuperAdmin(payload);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Super Admin created successfully",
            data: result,
        });
    }
);

export const UserControllers = {
    createDoctor,
    createAdmin,
    createSuperAdmin,
};
