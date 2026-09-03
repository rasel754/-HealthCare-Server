import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

/**
 * Route: GET /
 * Access: Public
 */
router.get(
    "/",
    DoctorController.getAllDoctors
);

/**
 * Route: GET /:id
 * Access: Public
 */
router.get(
    "/:id",
    DoctorController.getDoctorById
);

/**
 * Route: PATCH /:id
 * Access: ADMIN, SUPER_ADMIN, DOCTOR
 */
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
    validateRequest(updateDoctorZodSchema),
    DoctorController.updateDoctor
);

/**
 * Route: DELETE /:id
 * Access: ADMIN, SUPER_ADMIN
 */
router.delete(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.softDeleteDoctor
);

export const DoctorRoutes = router;
