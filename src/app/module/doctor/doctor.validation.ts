import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const updateDoctorZodSchema = z.object({
    name: z.string().optional(),
    profilePhoto: z.url("Invalid URL format").optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z
        .int("Experience must be an integer")
        .nonnegative("Experience cannot be negative")
        .optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]).optional(),
    appointmentFee: z
        .number()
        .positive("Appointment fee must be positive")
        .optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    specialties: z
        .array(z.uuid("Each specialty ID must be a valid UUID"))
        .optional(),
});

export const DoctorValidation = {
    updateDoctorZodSchema,
};
