import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

/**
 * Route: POST /register
 * Description: Registers a new patient account and returns access/refresh tokens.
 */
router.post("/register", AuthController.registerPatient);

/**
 * Route: POST /login
 * Description: Authenticates user credentials and returns access/refresh tokens.
 */
router.post("/login", AuthController.loginUser);

export const authRouters = router;
 