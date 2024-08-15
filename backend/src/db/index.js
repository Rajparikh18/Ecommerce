import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";


const connectDB= async()=>{
    try{
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
       console.log(`\n MongoDb connected !! DB HOST:${connectionInstance.connection.host}`);
        
    }catch(err){
        console.log(` Database connection error.ERR is : ${err}`);
        process.exit(1)
    }
}

export default connectDB;