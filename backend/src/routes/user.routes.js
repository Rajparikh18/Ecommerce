import {Router} from "express";
import { VerifyUserdetails,registerUser,loginUser, logoutUser,billingDetails,searchProduct, orders } from "../controllers/user.controller.js";
import { verifyJWT,verifyAdmin,verifyUser } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/payment.controller.js";

const router = Router();

router.route("/register").post(VerifyUserdetails)
router.route("/login").post(loginUser)
router.route("/createuser").post(registerUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/").get((req,res)=>{
    res.send("hello raj")
})
router.route("/billingdetails").post(verifyJWT,billingDetails);
router.route("/orders").get(verifyJWT,orders);
router.route("/products/search").get(searchProduct)

export default router;