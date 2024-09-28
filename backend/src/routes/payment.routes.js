import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
// Importing the controller functions
import { createOrder,verifyPayment } from "../controllers/payment.controller.js";

router.route("/createorder").post(verifyJWT,createOrder);
router.route("/verify").post(verifyJWT,verifyPayment);

export default router;