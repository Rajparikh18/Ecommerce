import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app=express();
const port=process.env.PORT || 8000;

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import userRouter from "./routes/user.routes.js"
import { User } from './models/user.model.js';


//routes declaration 
app.use("/users",userRouter);


// Signup 
app.post("/register",async(req,res)=>{
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
        user.token=token;
        user.password=undefined;

        res.status(201).json(user);


    }catch(err){
        console.log(err);
    }
})
app.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!(email && password)){
            res.status(400).send('send all data');
        }
        const user = await User.findOne({email});

        if(!user){
            res.send("user doesn't exist");
        }
        if(user && user.IspasswordCorrect(password)){
            const token=user.RefreshAccessToken();
            user.token=token;
            user.password=undefined;

        // sending token in cookie
        //cookie section

        const options={
            expires:new Date(Date.now()+3*24*3600*1000),
            httpOnly:true,
        }
        res.status(200).cookie("token",token,options).json({
            success:true,
            token,
            user
        })

        }


    } catch (error) {
        console.log(error);
    }
    
})

export {app,port}