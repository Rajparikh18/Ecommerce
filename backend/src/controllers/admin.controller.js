import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {Product}  from "../models/product.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import fs from "fs";

const createProduct = asyncHandler(async(req,res)=>{
    try {
        const localpath=req.files?.productImage[0]?.path;
        if(!localpath){
            throw new ApiError(400,"Product image is required");
        }
        const {characs,description,price,productName,fixedqty,category}=req.body;
        if(!(characs && description && price && productName && fixedqty && category)){
            fs.unlinkSync(localpath);
            throw new ApiError(400,"All fields are compulsory");
        }
        const image=await uploadOnCloudinary(localpath);
        if(!image){
            throw new ApiError(500,"Something went wrong while uploading the image");
        }
        const product=await Product.create({
            image:image.url,characs,description,price,productName,fixedqty,category
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

export {createProduct,getProducts,getProductById,deleteProduct,updateProduct,getProductsByCategory};