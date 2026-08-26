import express from 'express';

import { StatsController } from './stats.controller';
import { checkAuth } from '../middlewares/checkAuth';
import { Role } from '../../generated/prisma/enums';

const router = express.Router();

router.get(
    '/',
    checkAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.PATIENT),
    StatsController.getDashboardStatsData
)


export const StatsRoutes = router;