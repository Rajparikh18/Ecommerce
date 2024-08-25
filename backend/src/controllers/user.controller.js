import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        if(!(username && email && password)){
            res.status(400).send("All fields are compulsory");
        }
        // Checking if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(401).send('User already exist with this email');
        }
        const user=new User({
            username,email,password
        })
        await user.save();

        const token=user.generateAccessToken();
        user.refreshToken=token;
        user.password=undefined;

        res.status(201).json(user);


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
        const user = await User.findOne({email});

        if(!user){
            throw new ApiError(404,"User does not exist")
        }

        if(user && user.isPasswordCorrect(password)){
            const refreshtoken=user.RefreshAccessToken();
            const accesstoken =user.generateAccessToken();
            user.refreshToken=refreshtoken;

            await user.save();
            user.password=undefined;
            user.refreshToken=undefined;
        // sending token in cookie
        //cookie section

        const options={
            httpOnly:true,
            secure:true
        }
        res
        .status(200)
        .cookie("refreshtoken",refreshtoken,options)
        .cookie("accesstoken",accesstoken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user: user,accesstoken,refreshtoken
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
        .clearCookie("accesstoken",options)
        .clearCookie("refreshtoken",options)
        .json(new ApiResponse(200,{},"User logged Out"))   
    } catch (error) {
        throw new ApiError(401,"error: ",error)
    } 
})


export {registerUser,loginUser,logoutUser};