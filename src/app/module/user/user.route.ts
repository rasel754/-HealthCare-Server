import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router =Router();

router.post("/create-doctor",validateRequest(createDoctorZodSchema), UserControllers.createDoctor);

export const UserRoutes = router;