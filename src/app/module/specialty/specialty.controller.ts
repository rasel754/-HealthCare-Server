import { Request, Response } from "express";
import { SpecialtyService } from "./specialty.servive";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

/**
 * Controller to handle creation of a medical specialty.
 *
 * @route POST /api/v1/specialties
 * @access Admin
 */
const createSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const result = await SpecialtyService.createSpecialty(payload);

        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: "Specialty created successfully",
            data: result,
        });
    }
);

/**
 * Controller to fetch all medical specialties.
 *
 * @route GET /api/v1/specialties
 * @access Public / Authorized Roles
 */
const getAllSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const result = await SpecialtyService.getAllSpecialty();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialty get successfully",
            data: result,
        });
    }
);

/**
 * Controller to delete a specialty by ID.
 *
 * @route DELETE /api/v1/specialties/:id
 * @access Admin
 */
const deleteSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await SpecialtyService.deleteSpecialty(id as string);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialty deleted successfully",
            data: result,
        });
    }
);

/**
 * Controller to update a specialty by ID.
 *
 * @route PATCH /api/v1/specialties/:id
 * @access Admin
 */
const updateSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const payload = req.body;
        const result = await SpecialtyService.updateSpecialty(id as string, payload);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Specialty updated successfully",
            data: result,
        });
    }
);

export const SpecialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty,
};