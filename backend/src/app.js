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
import adminRouter from "./routes/admin.routes.js"
import sendOtpRouter from "./routes/sendOtp.routes.js"
import paymentRouter from "./routes/payment.routes.js"

//routes declaration 
app.use("/api",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/checkotp",sendOtpRouter);
app.use("/api/payment",paymentRouter);

export {app,port}