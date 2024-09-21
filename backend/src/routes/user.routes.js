import {Router} from "express";
import { VerifyUserdetails,registerUser,loginUser, logoutUser } from "../controllers/user.controller.js";
import { verifyJWT,verifyAdmin,verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(VerifyUserdetails)
router.route("/login").post(loginUser)
router.route("/createuser").post(registerUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/").get((req,res)=>{
    res.send("hello raj")
})


export default router;