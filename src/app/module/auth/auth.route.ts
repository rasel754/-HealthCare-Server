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

/**
 * Route: POST /change-password
 * Description: Changes the user's password.
 */
router.post("/change-password", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.changePassword);

/**
 * Route: POST /logout
 * Description: Logs out the user.
 */
router.post("/logout", checkAuth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN), AuthController.logOutUser);
router.post("/verify-email", AuthController.verifyEmail)

export const authRouters = router;
 