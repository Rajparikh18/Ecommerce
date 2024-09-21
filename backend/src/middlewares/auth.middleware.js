import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"
import {Admin} from "../models/admin.model.js"

export const verifyJWT=asyncHandler(async(req,res,next)=>{
try {
       const token=  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
       if(!token){
        throw new ApiError(401,"Unauthorized Request")
        }
       const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
       const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
       const admin=await Admin.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            if(!admin){
                throw new ApiError(401,"Invalid Access Token")
            }
            req.admin=admin;
            return next();
        }
       req.user= user;
       next();
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
}
})

export const verifyAdmin=asyncHandler(async(req,res,next)=>{
    if(!req.admin){
        throw new ApiError(401,"Unauthorized Request")
    }
    next();
});

export const verifyUser=asyncHandler(async(req,res,next)=>{
    if(!req.user){
        throw new ApiError(401,"Unauthorized Request")
    }
    next();
})
