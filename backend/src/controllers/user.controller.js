import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js";

const VerifyUserdetails = asyncHandler(async(req,res)=>{
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
        return res.status(285).json(new ApiResponse(285,req.body,"please verify otp"));
    }catch(error){
        throw new ApiError(500,error.message);
    }
});
const registerUser=asyncHandler(async(req,res)=>{
    try{
        const {username,email,password,number}=req.body;
        if(!(username && number && email && password )){
            throw new ApiError(400,"All fields are compulsory");
        }
        // Checking if user already exist
        const user=await User.create({
            username:username.toLowerCase(),email,password,number
        })
        const createdUser=await User.findById(user._id).select("-refreshToken");
        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user");
        }

        if(createdUser && await createdUser.isPasswordCorrect(password)){
            const refreshToken=createdUser.RefreshAccessToken();
            const accessToken =createdUser.generateAccessToken();
            createdUser.refreshToken=refreshToken;

            await createdUser.save();
            createdUser.password=undefined;
            createdUser.refreshToken=undefined;
        // sending token in cookie
        //cookie section

        const Aoptions={
            httpOnly:true,
            secure:true,
            maxAge:60*60*1000
        }
        const Roptions={
            httpOnly:true,
            secure:true,
            maxAge:7*24*60*60*1000
        }
            res
        .status(200)
        .cookie("refreshToken",refreshToken,Roptions)
        .cookie("accessToken",accessToken,Aoptions)
        .json(
           new ApiResponse(
                200,
                {
                    user: createdUser
                },
                "User registered and logged In successfully"
            )
        )
        }
        else{
            throw new ApiError(401,"Something went wrong")
        }
    }catch(error){
        throw new ApiError(500,error.message);
    }
});

const loginUser=asyncHandler(async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!(email && password)){
            throw new ApiError(400,"email and password both are required")
        }
        const user = await User.findOne({email});
        if(!user){
            const admin= await Admin.findOne({email}).select("-number");
            if(admin && await admin.isPasswordCorrect(password)){
               return res.status(285).json(new ApiResponse(285,admin,"Admin exist please verify otp"));
            }else{
                throw new ApiError(401,"Password is incorrect")
            }
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

        const Aoptions={
            httpOnly:true,
            secure:true,
            maxAge:60*60*1000
        }
        const Roptions={
            httpOnly:true,
            secure:true,
            maxAge:7*24*60*60*1000
        }
            res
        .status(200)
        .cookie("refreshToken",refreshToken,Roptions)
        .cookie("accessToken",accessToken,Aoptions)
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
        else{
            throw new ApiError(401,"Password is incorrect")
        }
    } catch (error) {
        console.log(error);
    }
})

const logoutUser=asyncHandler(async(req,res)=>{
    try {
        if(req.admin){
            await Admin.findByIdAndUpdate(
                req.admin._id,
                {
                    $set:{
                        refreshToken:undefined
                    }
                },
                {
                    new:true
                }
            )
            const Aoptions={
                httpOnly:true,
                secure:true,
                maxAge:60*60*1000
            }
            const Roptions={
                httpOnly:true,
                secure:true,
                maxAge:7*24*60*60*1000
            }
            return res
        .status(200)
        .clearCookie("accessToken",Aoptions)
        .clearCookie("refreshToken",Roptions)
        .json(new ApiResponse(200,{},"Admin logged Out")) 
        }
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
            secure:true,
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




export {VerifyUserdetails,registerUser,loginUser,logoutUser,getCurrentUser};