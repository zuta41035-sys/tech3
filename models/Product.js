import mongoose from "mongoose";

const productSchema = new mongoose.Schema ({
    userId: { type: String , required : true, ref: "user" },
    name: {type: String , Required : true},
    description: {type: String , Required : true},
    price: {type: Number , Required : true},
    offerPrice: {type: Number , Required : true},
    image: {type: Array , Required : true},
    category: { type: String, required: true }, 
    date: { type: Number, required: true }  

})

const Product = mongoose.models.product || mongoose.model('product' , productSchema)

export default Product