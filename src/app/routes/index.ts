import { Router } from "express";
import { SpecialtyRouter } from "../module/specialty/specialty.route";

const router =Router();

router.use('/specialty',SpecialtyRouter);


export const indexRouter = router
