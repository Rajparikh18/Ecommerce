import {Router} from "express";
import { registerUser,loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/api/register").post(registerUser)
router.route("/api/login").post(loginUser)

//secured routes
router.route("/api/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/").get((req,res)=>{
    res.send("hello raj")
})


export default router;