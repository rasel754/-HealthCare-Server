import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";
import { authRouters } from "../module/auth/auth.route";

const router =Router();

router.use('/auth',authRouters);
router.use('/specialty',SpecialtyRouter);


export const indexRouter = router
