const Joi = require("joi");
const mongoose = require("mongoose");

// Helper to validate ObjectId format
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

// Joi schema
const orderValidationSchema = Joi.object({
  orderID: Joi.string().required(),
  userID: Joi.string().required(),
  user: objectId.required(),

  items: Joi.array()
    .items(
      Joi.object({
        productID: objectId.required(),
        name: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().required(),
      })
    )
    .min(1)
    .required(),

  totalAmount: Joi.number().required(),

  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed")
    .default("pending"),

  orderStatus: Joi.string()
    .valid("processing", "shipped", "delivered", "cancelled")
    .default("processing"),

  shippingAddress: objectId.required(),
  shippingDate: Joi.date().required(),
  orderDate: Joi.date().required(),
  estimatedDeliveryTime: Joi.date().required(),
});
