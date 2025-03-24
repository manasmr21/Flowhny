const Joi = require("joi");
const mongoose = require("mongoose");
const {addressSchema} = require("./userValidator");

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
        product: objectId.required(),
        productID: Joi.string().required(),
        quantity: Joi.number().min(1).required()
      })
    )
    .min(1)
    .required(),

  totalPrice: Joi.number().required(),

  paymentStatus: Joi.string()
    .valid("pending", "paid", "failed","Cash On Delivery", "refunded")
    .default("pending"),

  orderStatus: Joi.string()
    .valid("processing", "shipped", "delivered", "cancelled")
    .default("processing"),

  shippingAddress: addressSchema.required(),
  shippingDate: Joi.date().required(),
  orderDate: Joi.date().required(),
  estimatedDeliveryDate: Joi.string().required(),
});


module.exports = orderValidationSchema;