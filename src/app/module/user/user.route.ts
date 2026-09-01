import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema, createSuperAdminZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

/**
 * Route: POST /create-doctor
 * Description: Registers a new doctor account with associated specialties.
 */
router.post(
    "/create-doctor",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(createDoctorZodSchema),
    UserControllers.createDoctor
);
 
/**
 * Route: POST /create-admin
 * Access: SUPER_ADMIN only
 */
router.post(
    "/create-admin",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(createAdminZodSchema),
    UserControllers.createAdmin
);

/**
 * Route: POST /create-super-admin
 * Access: SUPER_ADMIN only
 */
router.post(
    "/create-super-admin",
    checkAuth(Role.SUPER_ADMIN),
    validateRequest(createSuperAdminZodSchema),
    UserControllers.createSuperAdmin
);

export const UserRoutes = router;

