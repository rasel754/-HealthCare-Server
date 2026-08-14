import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

/**
 * Route: POST /
 * Description: Creates a new medical specialty record.
 */
router.post('/',checkAuth(Role.ADMIN,Role.SUPER_ADMIN), SpecialtyController.createSpecialty);


router.get('/', SpecialtyController.getAllSpecialty);


router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty);

/**
 * Route: PATCH /:id
 * Description: Updates a medical specialty record by ID.
 */
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.updateSpecialty);

export const SpecialtyRouter = router;
