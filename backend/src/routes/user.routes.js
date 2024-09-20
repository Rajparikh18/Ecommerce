import {Router} from "express";
import { VerifyUserdetails,registerUser,loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(VerifyUserdetails)
router.route("/login").post(loginUser)
router.route("/createuser").post(registerUser);

//secured routes
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/").get((req,res)=>{
    res.send("hello raj")
})


export default router;