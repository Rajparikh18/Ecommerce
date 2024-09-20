import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Admin } from "../models/admin.model.js";
import {Router} from "express";

const router = Router();
const otp1=555555;
const otp2=666666;
router.route("/sendotp").get(asyncHandler(async(req,res)=>{
    if(req.body.email && req.body.number){
        res.status(237).json(new ApiResponse(237,otp1,"OTP sent on number successfully"));
    }
    else if(req.body.email && !req.body.number){
        res.status(244).json(new ApiResponse(244,otp2,"OTP sent on email successfully"));
    }
    else{
        throw new ApiError(400,"Please provide email or number");
    }
}))
        
export default router;