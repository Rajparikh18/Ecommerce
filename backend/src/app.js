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


//routes declaration 
app.use("/users",userRouter);


app.get("/users",(req,res)=>{
    const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];
      res.json(users);
});


export {app,port}