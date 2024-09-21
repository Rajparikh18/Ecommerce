import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema=new Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        index:true
    },
    number:{
        type:Number,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    },
    
})

adminSchema.pre("save",async function (next){ // we didn,t use arrow funct cuz we can access this keyword
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    console.log("using hash");
    next();
})
adminSchema.methods.isPasswordCorrect = async function (password) { // this is used to create our custom methods like save/updateOne etc..
    return await bcrypt.compare(password,this.password);
}
adminSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
           _id:this._id,
           email:this.email,
           username:this.username 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ADMIN_ACCESS_TOKEN_EXPIRY
        }
    )
}
adminSchema.methods.RefreshAccessToken=function(){
    return jwt.sign(
        {
           _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.ADMIN_REFRESH_TOKEN_EXPIRY
        }
    )
}
export const Admin=mongoose.model('Admin',adminSchema);