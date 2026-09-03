import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { profileUploadMiddleware } from "../../middlewares/profileUpload.middleware";

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
    multerUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    profileUploadMiddleware,
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
