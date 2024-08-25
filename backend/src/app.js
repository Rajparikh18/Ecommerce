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
app.use("/api/register",userRouter)
app.use("/api/login",userRouter)
app.use("/api/logout",userRouter)
app.use("/",userRouter)

export {app,port}