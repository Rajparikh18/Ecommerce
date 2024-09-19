import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";

const registerUser = asyncHandler(async(req,res)=>{
    try{
        const {username,email,password,number}=req.body;
        if(!(username && number && email && password )){
            throw new ApiError(400,"All fields are compulsory");
        }
        // Checking if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new ApiError(409,"user with this email already exist");
        }
        const user=await User.create({
            username:username.toLowerCase(),email,password,number
        })
        const createdUser=await User.findById(user._id).select("-password -refreshToken");
        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user");
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        );


    }catch(err){
        console.log(err);
    }
})

const loginUser=asyncHandler(async(req,res)=>{
    try {
        const {email,password}=req.body;

        
        if(!(email && password)){
            throw new ApiError(400,"email and password both are required")
        }
        let user = await User.findOne({email});
        let admin;
        if(!user){
            admin= await Admin.findOne({email});
            user=admin;
        }

        if(!user){
            throw new ApiError(404,"User does not exist")
        }

        if(user && await user.isPasswordCorrect(password)){
            const refreshToken=user.RefreshAccessToken();
            const accessToken =user.generateAccessToken();
            user.refreshToken=refreshToken;

            await user.save();
            user.password=undefined;
            user.refreshToken=undefined;
        // sending token in cookie
        //cookie section

        const options={
            httpOnly:true,
            secure:true
        }
        if(user==admin){
            res
            .status(285)
            .cookie("refreshToken",refreshToken,options)
            .cookie("accessToken",accessToken,options)
            .json(
               new ApiResponse(
                    285,
                    {
                        admin: user
                    },
                    "Admin logged In successfully"
                )
            )
        }
        else{
            res
        .status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(
           new ApiResponse(
                200,
                {
                    user: user
                },
                "User logged In successfully"
            )
        )
        }
        
        }
        else{
            throw new ApiError(401,"Password is incorrect")
        }
    } catch (error) {
        console.log(error);
    }
})

const logoutUser=asyncHandler(async(req,res)=>{
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {
                new:true
            }
        )
        const options={
            httpOnly:true,
            secure:true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"User logged Out"))   
    } catch (error) {
        throw new ApiError(401,"error: ",error)
    } 
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request");
    }

   try {
     const decodedToken=jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user=await User.findById(decodedToken?._id);
 
     if(!user){
         throw new ApiError(401,"Invalid refresh token")
     }
     if(incomingRefreshToken!==user?.refreshToken){
         throw new ApiError(401,"Refresh token is expired or used"); 
     }
     const options={
         httpOnly:true,
         secure:true
     }
 
     const refreshToken=user.RefreshAccessToken();
         const accessToken=user.generateAccessToken();
         user.accessToken=accessToken; // something is wrong
         user.refreshToken=refreshToken;
 
         await user.save();
         user.password=undefined;
         
         return res.status(200)
         .cookie("accessToken",accessToken,options)
         .cookie("refreshToken",refreshToken,options)
         .json(
             new ApiResponse(
                 200,
                 {accessToken,refreshToken},
                 "Access token refreshed"
             )
         )
 
   } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
   }

});

const changePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await User.findById(req.user._id);
    
    const isPasswordCorrect=await User.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw ApiError(400,"Invalid old password");
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(
        new ApiResponse(200,{},"Password changed Successfully")
    )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,req.user,"current user fetched")
    )
})




export {registerUser,loginUser,logoutUser,refreshAccessToken,getCurrentUser};