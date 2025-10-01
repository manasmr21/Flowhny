const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: Number,
    rating: Number,
    brand: String,
    stock: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    shippingInformation: {
      type: String,
      required: true,
    },
    reviews: [
      {
        rating: Number,
        comment: String,
        date: Date,
        reviewerName: String,
        reviewerEmail: String,
        reviewerID: String,
      },
    ],
    returnPolicy: {
      type: String,
      required: true,
    },
    availabilityStatus: {
      type: String,
      required: true,
    },
    minimumOrderQuantity: Number,
    images: [
      {
        type: {
          typeName: {
            type: String,
            required: true,
          },
          filename: {
            type: String,
            required: true,
            unique: true,
          },
          displayPath: {
            type: String,
            required: true,
            unique: true,
          },
          mimetype: String,
          originalname: String,
          size: Number,
        },
        maxlength: 5,
        minlength: 1,
        required: true,
      },
    ],
    thumbnail: {
      type: {
        typeName: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
          unique: true,
        },
        displayPath: {
          type: String,
          required: true,
          unique: true,
        },
        mimetype: String,
        originalname: String,
        size: Number,
      },
      required: true,
    },
  },
  { timestamps: true }
);

const productDb = new mongoose.model("products", productSchema);

module.exports = productDb;
