import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

/**
 * Route: POST /create-doctor
 * Description: Registers a new doctor account with associated specialties.
 * Middlewares: validateRequest(createDoctorZodSchema)
 */
router.post(
    "/create-doctor",
    validateRequest(createDoctorZodSchema),
    UserControllers.createDoctor
);

export const UserRoutes = router;