import mongoose,{Schema} from 'mongoose';

const productSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true,
        index:true
    },
    price: {
        type: Array,
        required: true
    },
    characs:{
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fixedqty: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    }
});

export const Product = mongoose.model('Product', productSchema);
