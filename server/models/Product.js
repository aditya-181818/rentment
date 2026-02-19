import mongoose from "mongoose";
const{ObjectId} = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: 'User'},
    name: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    pricePerDay: {type: Number, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    isAvailable: {type: Boolean, default: true}
},{timestamps: true})



const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
