import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router();

/**
 * Route: POST /
 * Description: Creates a new medical specialty record.
 */
router.post('/', SpecialtyController.createSpecialty);

/**
 * Route: GET /
 * Description: Retrieves all medical specialties.
 */
router.get('/', SpecialtyController.getAllSpecialty);

/**
 * Route: DELETE /:id
 * Description: Deletes a medical specialty record by ID.
 */
router.delete('/:id', SpecialtyController.deleteSpecialty);

/**
 * Route: PATCH /:id
 * Description: Updates a medical specialty record by ID.
 */
router.patch('/:id', SpecialtyController.updateSpecialty);

export const SpecialtyRouter = router;