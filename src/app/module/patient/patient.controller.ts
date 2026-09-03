import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PatientService } from "./patient.service";
import { IRequestUser } from "../../interface/requestUser.interface";
import { IQueryParams } from "../../interface/query.interface";

/**
 * Controller to fetch all registered patients with pagination, filters, and search.
 * @route GET /api/v1/patient
 */
const getAllPatients = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PatientService.getAllPatients(query as IQueryParams);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Patients fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Controller to fetch a specific patient by ID.
 * @route GET /api/v1/patient/:id
 */
const getPatientById = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.getPatientById(req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Patient fetched successfully",
        data: result,
    });
});

/**
 * Controller to update patient data by ID.
 * @route PATCH /api/v1/patient/:id
 */
const updatePatient = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.updatePatient(req.params.id as string, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Patient updated successfully",
        data: result,
    });
});

/**
 * Controller to soft delete a patient record by ID.
 * @route DELETE /api/v1/patient/:id
 */
const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
    const result = await PatientService.softDeletePatient(req.params.id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Patient deleted successfully",
        data: result,
    });
});

/**
 * Controller for patient to update their own profile and medical reports.
 * @route PATCH /api/v1/patient/update-my-profile
 */
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload = req.body;

    const result = await PatientService.updateMyProfile(user, payload);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: "Profile updated successfully",
        data: result,
    });
});

export const PatientController = {
    getAllPatients,
    getPatientById,
    updatePatient,
    softDeletePatient,
    updateMyProfile,
};