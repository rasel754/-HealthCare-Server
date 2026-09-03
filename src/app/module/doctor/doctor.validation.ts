import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema = z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.coerce.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    appointmentFee: z.coerce.number().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    specialties: z.array(z.string()).optional(),
});

export const DoctorValidation = {
    updateDoctorZodSchema,
};
