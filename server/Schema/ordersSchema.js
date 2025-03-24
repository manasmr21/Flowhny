const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postalCode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "India",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const ordersSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        productID:{
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        }
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "Cash On Delivery", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    shippingAddress: {
      type: addressSchema,
      required: true
    },
    shippingDate: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    estimatedDeliveryDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const orderDb = new mongoose.model("orders", ordersSchema);

module.exports = orderDb;
