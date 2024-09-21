import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Product}  from "../models/product.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import fs from "fs";
import { Admin} from "../models/admin.model.js";

const adminregister = asyncHandler(async(req,res)=>{
    try{
        const {username,email,password,number}=req.body;
        if(!(username && number && email && password )){
            throw new ApiError(400,"All fields are compulsory");
        }
        // Checking if user already exist
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            throw new ApiError(409,"Admin with this email already exist");
        }
        const admin=await Admin.create({
            username:username.toLowerCase(),email,password,number
        })
        const createdAdmin=await Admin.findById(admin._id).select("-password -refreshToken");
        if(!createdAdmin){
            throw new ApiError(500,"Something went wrong while registering the user");
        }
        return res.status(201).json(
            new ApiResponse(200,createdAdmin,"Admin registered successfully")
        );
    }catch(err){
        console.log(err);
    }
});
const adminlogin=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!(email && password)){
        throw new ApiError(400,"email and password both are required")
    }
    const admin = await Admin.findOne({email});
    if(!admin){
        throw new ApiError(404,"Admin does not exist")
    }

    if(admin){
        const refreshToken=admin.RefreshAccessToken();
        const accessToken =admin.generateAccessToken();
        admin.refreshToken=refreshToken;

        await admin.save();
        admin.password=undefined;
        admin.refreshToken=undefined;
    // sending token in cookie
    //cookie section

    const Roptions={
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000,
    }
    const Aoptions={
        httpOnly:true,
        secure:true,
        maxAge:15*60*1000,
    }
        res
    .status(200)
    .cookie("refreshToken",refreshToken,Roptions)
    .cookie("accessToken",accessToken,Aoptions)
    .json(
       new ApiResponse(
            200,
            {
                admin: admin
            },
            "Admin logged In successfully"
        )
    )
}});
const createProduct = asyncHandler(async(req,res)=>{
    try {
        const localpath=req.files?.productImage[0]?.path;
        if(!localpath){
            throw new ApiError(400,"Product image is required");
        }
        const {characs,description,price,productName,fixedqty,category,availability}=req.body;
        if(!(characs && description && price && productName && fixedqty && category && availability)){
            fs.unlinkSync(localpath);
            throw new ApiError(400,"All fields are compulsory");
        }
        const image=await uploadOnCloudinary(localpath);
        if(!image){
            fs.unlinkSync(localpath);
            throw new ApiError(500,"Something went wrong while uploading the image");
        }
        const product=await Product.create({
            image:image.url,characs,description,price,productName,fixedqty,category,availability
        })
        if(!product){
            throw new ApiError(500,"Something went wrong while creating the product");
        }

        return res.status(201).json(
            new ApiResponse(200,product,"Product created successfully")
        );

    } catch (err) {
        console.log(err);
    }
})
const getProducts = asyncHandler(async(req,res)=>{
    try {
        const products=await Product.find({});
        if(!products){
            throw new ApiError(404,"No products found");
        }
        return res.status(200).json(
            new ApiResponse(200,products,"Products fetched successfully")
        )
    } catch (err) {
        console.log(err);
    }
});
const getProductById = asyncHandler(async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id);
        if(!product){
            throw new ApiError(404,"Product not found");
        }
        return res.status(200).json(
            new ApiResponse(200,product,"Product fetched successfully")
        )
    } catch (err) {
        console.log(err);
    }
})
const deleteProduct = asyncHandler(async(req,res)=>{
    try {
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            throw new ApiError(404,"Product not found");
        }
        return res.status(200).json(
            new ApiResponse(200,product,"Product deleted successfully")
        )
    } catch (err) {
        console.log(err);
    }
});
const updateProduct = asyncHandler(async(req,res)=>{
    try {
        console.log(req.body);
        const localpath=req.files?.productImage[0]?.path;
        const {characs,description,price,productName,fixedqty,category,availability}=req.body;
        if(localpath){
            if(!(characs && description && price && productName && fixedqty && category && availability)){
                fs.unlinkSync(localpath);
                throw new ApiError(400,"All fields are compulsory");
            }
            const image=await uploadOnCloudinary(localpath);
            if(!image){
                fs.unlinkSync(localpath);
                throw new ApiError(500,"Something went wrong while uploading the image");
            }
            req.body.image=image.url;
        }
        
        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!product){
            throw new ApiError(404,"Product not found");
        }
        return res.status(200).json(
            new ApiResponse(200,product,"Product updated successfully")
        )
    } catch (err) {
        console.log(err);
    }
});
const getProductsByCategory = asyncHandler(async(req,res)=>{
    try {
        const products=await Product.find({category:req.params.category});
        if(!products){
            throw new ApiError(404,"No products found");
        }
        return res.status(200).json(
            new ApiResponse(200,products,"Products fetched successfully")
        )
    } catch (err) {
        console.log(err);
    }
});

export {adminlogin,createProduct,adminregister,getProducts,getProductById,deleteProduct,updateProduct,getProductsByCategory};