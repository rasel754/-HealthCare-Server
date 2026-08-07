import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { authRouters } from "../module/auth/auth.route";
import { UserRoutes } from "../module/user/user.route";

const router =Router();

router.use('/auth',authRouters);
router.use('/specialty',SpecialtyRouter);
router.use('/users',UserRoutes);


export const indexRouter = router
