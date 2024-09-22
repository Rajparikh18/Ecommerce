import mongoose,{Schema} from "mongoose";

const billingDetailSchema = new Schema ({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    address:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    city:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    phoneNumber: {
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'],
        required: true,
        unique:true
      },
    postCode:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    cart:{
        type:Array,
        required:true,
        trim:true,
        lowercase:true
    }
})

export const billingSchema=mongoose.model('billingDetails',billingDetailSchema);