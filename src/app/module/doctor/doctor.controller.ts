import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { Request, Response } from "express";

/**
 * Controller to retrieve all doctor records along with associated user and specialty details.
 *
 * @route GET /api/v1/doctor
 * @access Public / Authorized Roles
 */
const getAllDoctors = catchAsync(
    async (req: Request, res: Response) => {
        const result = await DoctorService.getAllDoctors();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctors fetched successfully",
            data: result,
        });
    }
);

/**
 * Controller to retrieve a single doctor by unique ID.
 *
 * @route GET /api/v1/doctor/:id
 * @access Public / Authorized Roles
 */
const getDoctorById = catchAsync(
    async (req: Request, res: Response) => {
        const result = await DoctorService.getDoctorById(req.params.id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor fetched successfully",
            data: result,
        });
    }
);

/**
 * Controller to update a doctor's basic information and/or assigned specialties.
 *
 * @route PATCH /api/v1/doctor/:id
 * @access Admin / Authorized Doctor
 */
const updateDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const result = await DoctorService.updateDoctor(req.params.id as string, req.body);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor updated successfully",
            data: result,
        });
    }
);

/**
 * Controller to delete a doctor record by ID.
 *
 * @route DELETE /api/v1/doctor/:id
 * @access Admin
 */
const deleteDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const result = await DoctorService.deleteDoctor(req.params.id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Doctor deleted successfully",
            data: result,
        });
    }
);

export const DoctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
};

