import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SuperAdminService } from "./superAdmin.service";

const getAllSuperAdmins = catchAsync(async (req: Request, res: Response) => {
    const result = await SuperAdminService.getAllSuperAdmins();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super Admins retrieved successfully",
        data: result,
    });
});

const getSuperAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SuperAdminService.getSuperAdminById(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super Admin retrieved successfully",
        data: result,
    });
});

const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SuperAdminService.updateSuperAdmin(id as string, req.body);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super Admin updated successfully",
        data: result,
    });
});

const softDeleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SuperAdminService.softDeleteSuperAdmin(id as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Super Admin deleted successfully",
        data: result,
    });
});

export const SuperAdminController = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    softDeleteSuperAdmin,
};
