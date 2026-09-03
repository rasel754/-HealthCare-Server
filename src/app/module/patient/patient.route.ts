import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { PatientController } from "./patient.controller";
import { updateMyPatientProfileMiddleware } from "./patient.middlewares";
import { multerUpload } from "../../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { PatientValidation } from "./patient.validation";

const router = Router();

/**
 * Route: GET /
 * Access: SUPER_ADMIN, ADMIN, DOCTOR
 */
router.get(
    "/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR),
    PatientController.getAllPatients
);

/**
 * Route: PATCH /update-my-profile
 * Access: PATIENT
 */
router.patch(
    "/update-my-profile",
    checkAuth(Role.PATIENT),
    multerUpload.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "medicalReports", maxCount: 5 }
    ]),
    updateMyPatientProfileMiddleware,
    validateRequest(PatientValidation.updatePatientProfileZodSchema),
    PatientController.updateMyProfile
);

/**
 * Route: GET /:id
 * Access: SUPER_ADMIN, ADMIN, DOCTOR, PATIENT
 */
router.get(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
    PatientController.getPatientById
);

/**
 * Route: PATCH /:id
 * Access: SUPER_ADMIN, ADMIN
 */
router.patch(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(PatientValidation.updatePatientZodSchema),
    PatientController.updatePatient
);

/**
 * Route: DELETE /:id
 * Access: SUPER_ADMIN, ADMIN
 */
router.delete(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    PatientController.softDeletePatient
);

export const PatientRoutes = router;