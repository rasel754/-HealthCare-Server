import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { authRouters } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";
import { DoctorRoutes } from "../module/doctor/doctor.route";

const router = Router();

router.use('/auth', authRouters);
router.use('/specialty', SpecialtyRouter);
router.use('/users', UserRoutes);
router.use('/doctors', DoctorRoutes);


export const indexRouter = router
