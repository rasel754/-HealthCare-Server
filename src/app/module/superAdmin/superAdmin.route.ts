import { Router } from "express";
import { SuperAdminController } from "./superAdmin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateSuperAdminZodSchema } from "./superAdmin.validation";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { profileUploadMiddleware } from "../../middlewares/profileUpload.middleware";

const router = Router();

router.get(
    "/",
    checkAuth(Role.SUPER_ADMIN),
    SuperAdminController.getAllSuperAdmins
);

router.get(
    "/:id",
    checkAuth(Role.SUPER_ADMIN),
    SuperAdminController.getSuperAdminById
);

router.patch(
    "/:id",
    checkAuth(Role.SUPER_ADMIN),
    multerUpload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    profileUploadMiddleware,
    validateRequest(updateSuperAdminZodSchema),
    SuperAdminController.updateSuperAdmin
);

router.delete(
    "/:id",
    checkAuth(Role.SUPER_ADMIN),
    SuperAdminController.softDeleteSuperAdmin
);

export const SuperAdminRoutes = router;
