import z from "zod";

export const updateSuperAdminZodSchema = z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
});

export const SuperAdminValidation = {
    updateSuperAdminZodSchema,
};
