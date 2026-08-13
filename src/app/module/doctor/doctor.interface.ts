import { Gender } from "../../../generated/prisma/enums";

/**
 * Interface representing a specialty update operation for a doctor.
 */
export interface IUpdateDoctorSpecialtyPayload {
    /** UUID of the specialty */
    specialtyId: string;
    /** If true, removes this specialty association; otherwise ensures it is added */
    shouldDelete?: boolean;
}

/**
 * Interface representing partial payload to update doctor information and/or specialties.
 */
export interface IUpdateDoctorPayload {
    /** Partial doctor profile fields to update */
    doctor?: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number;
        registrationNumber?: string;
        gender?: Gender;
        appointmentFee?: number;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    };
    /** Array of string specialty IDs or specialty update objects */
    specialties?: (string | IUpdateDoctorSpecialtyPayload)[];
}