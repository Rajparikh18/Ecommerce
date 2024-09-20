import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Admin } from "../models/admin.model.js";
import {Router} from "express";
import { generateOTP,sendOTPEmail,sendOTPSMS } from "../controllers/otp.controller.js";

const router = Router();

router.route("/sendotp").post(asyncHandler(
    async(req,res)=>{
    if(req.body.email && req.body.number){
        const otp1 = generateOTP();
        await sendOTPSMS(req.body.number,otp1);
        res.status(237).json(new ApiResponse(237,otp1,"OTP sent on number successfully"));
    }
    else if(req.body.email && !req.body.number){
        const otp2 = generateOTP();
        await sendOTPEmail(req.body.email,otp2);
        res.status(244).json(new ApiResponse(244,otp2,"OTP sent on email successfully"));
    }
    else{
        throw new ApiError(400,"Please provide email or number");
    }
}))
        
export default router;