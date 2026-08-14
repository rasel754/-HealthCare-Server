import z from "zod";

export const updateAdminZodSchema = z.object({
    name: z.string().optional(),
    profilePhoto: z.url("Invalid URL format").optional(),
    contactNumber: z.string().optional(),
});

export const AdminValidation = {
    updateAdminZodSchema,
};
