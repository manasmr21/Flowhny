const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    orderID: {
      type: "String",
      required: true,
      unique: true,
    },
    userID: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
      required: true,
    },
    shippingDate: {
      type: Date,
      required: true,
    },
    orderDate:{
        type: Date,
        required: true
    },
    estimatedDeliveryTime:{
        type: Date,
        required: true
    },
  },
  { timestamps: true }
);

const orderDb = new mongoose.model("orders", ordersSchema);

module.exports = orderDb;