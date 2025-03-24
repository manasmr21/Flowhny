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
    price:{
        type : Number,
        required : true
    },
    discountPercentage: Number,
    rating: Number,
    stocks: {
        type : Number,
        required: true
    },
    tags: [{
        type : String,
        required: true
    }],
    sku:{
        type: String,
        required : true
    },
    weight: Number,
    dimension: {
        width : Number,
        length: Number,
        height: Number
    },
    warrantyInformation: {
        type: String,
        required: true
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
    minimumOrderQuantity: Number,
    images:[{
        type: String
    }],
    thumbnail:{
        type: String,
        required: true
    }
}, {timestamps : true})

const productDb = new mongoose.model("products", productSchema)

module.exports = productDb