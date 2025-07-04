const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productID : {
        type : String,
        required: true,
        unique : true
    },
    title:{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type : Number,
        required : true
    },
    discountPercentage: Number,
    rating: Number,
    brand: String,
    stock: {
        type : Number,
        required: true
    },
    tags: [{
        type : String,
        required: true  
    }],
    sku:{
        type: String,
        required : true,
        unique: true
    },
    shippingInformation: {
        type: String,
        required: true
    },
    reviews: [{
        rating : Number,
        comment: String,
        date: Date,
        reviewerName : String,
        reviewerEmail: String,
        reviewerID: String
    }],
    returnPolicy: {
        type: String,
        required: true
    },
    availabilityStatus:{
        type: String,
        required: true
    },
    minimumOrderQuantity: Number,
    images:[{
        id: String,
        data: String
    }],
    thumbnail:{
        type: String,
        required: true
    }
}, {timestamps : true})

const productDb = new mongoose.model("products", productSchema)

module.exports = productDb