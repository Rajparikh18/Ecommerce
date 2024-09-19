import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Admin } from "../models/admin.model.js";
import {Router} from "express";

const router = Router();
const otp=555555;
router.route("/sendotp").get(asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,process.env.STRIPE_SECRET_KEY=otp,"OTP sent successfully",{}));
}))
        
export default router;