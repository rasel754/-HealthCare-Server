import { Router } from "express";
import { PaymentControler } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT, Role.DOCTOR), PaymentControler.getAllPayments);
router.post("/confirm-payment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT), PaymentControler.confirmPayment);

export const paymentRoutes = router;
