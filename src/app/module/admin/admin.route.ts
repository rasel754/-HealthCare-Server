import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    AdminController.getAllAdmins
);

router.get(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    AdminController.getAdminById
);

router.patch(
    "/:id",
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
    validateRequest(updateAdminZodSchema),
    AdminController.updateAdmin
);

router.delete(
    "/:id",
    checkAuth(Role.SUPER_ADMIN),
    AdminController.softDeleteAdmin
);

export const AdminRoutes = router;
