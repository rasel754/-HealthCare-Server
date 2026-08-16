import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllAdmins();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admins retrieved successfully",
        data: result,
    });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.getAdminById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin retrieved successfully",
        data: result,
    });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateAdmin(id as string, req.body);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin updated successfully",
        data: result,
    });
});

const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user
    const result = await AdminService.softDeleteAdmin(id as string, user);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Admin deleted successfully",
        data: result,
    });
});

export const AdminController = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin,
};
