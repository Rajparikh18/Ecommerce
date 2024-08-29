import mongoose,{Schema} from 'mongoose';

const productSchema = new Schema({
    image: {
        type: String,
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
    weight: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
});

export const Product = mongoose.model('Product', productSchema);
