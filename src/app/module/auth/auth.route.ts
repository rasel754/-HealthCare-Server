import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

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

/**
 * Route: GET /me
 * Description: Gets the logged in user.
 */
router.get("/me",checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.getMe);

/**
 * Route: POST /refresh-token
 * Description: Gets new access and refresh tokens.
 */
router.post("/refresh-token", AuthController.getNewToken);


export const authRouters = router;
 