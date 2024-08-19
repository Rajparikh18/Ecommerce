import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app,port} from './app.js';

dotenv.config({
    path:"./env"
})
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERRR: ",error);
        throw error;
       });
    app.listen(port,()=>{
        console.log(`Server is running at port :${port}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! " ,err);
})