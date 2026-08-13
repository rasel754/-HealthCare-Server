import { Gender } from "../../../generated/prisma/enums";

/**
 * Interface representing the payload required to create a new Doctor user.
 */
export interface ICreateDoctorPayload {
    /** Raw user account password for initial auth registration */
    password: string;

    /** Detailed profile information of the doctor */
    doctor: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber: string;
        experience?: number;
        gender: Gender;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    };

    /** Array of specialty UUIDs associated with the doctor */
    specialties: string[];
}