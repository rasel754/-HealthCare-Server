import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

/**
 * Route: GET /
 * Description: Fetches all doctor records with associated user and specialty data.
 */
router.get('/', DoctorController.getAllDoctors);

/**
 * Route: GET /:id
 * Description: Fetches a single doctor record by ID.
 */
router.get('/:id', DoctorController.getDoctorById);

/**
 * Route: PATCH /:id
 * Description: Updates a doctor's basic info, user name, and specialty list.
 */
router.patch('/:id', DoctorController.updateDoctor);

/**
 * Route: DELETE /:id
 * Description: Removes a doctor record by ID.
 */
router.delete('/:id', DoctorController.deleteDoctor); 

export const DoctorRoutes = router;