const Joi = require("joi");

const productValidationSchema = Joi.object({
  productID: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  discountPercentage: Joi.number().min(0).max(100).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  stocks: Joi.number().required(),
  tags: Joi.array().items(Joi.string().required()).required(),
  sku: Joi.string().required(),
  weight: Joi.number().optional(),
  dimension: Joi.object({
    width: Joi.number().optional(),
    length: Joi.number().optional(),
    height: Joi.number().optional(),
  }).optional(),
  warrantyInformation: Joi.string().required(),
  shippingInformation: Joi.string().required(),
  reviews: Joi.array()
    .items(
      Joi.object({
        rating: Joi.number().min(0).max(5).optional(),
        comment: Joi.string().optional(),
        date: Joi.date().optional(),
        reviewerName: Joi.string().optional(),
        reviewerEmail: Joi.string().email().optional(),
        reviewerID: Joi.string().optional(),
      })
    )
    .optional(),
  returnPolicy: Joi.string().required(),
  minimumOrderQuantity: Joi.number().default(24),
  images: Joi.array().items(Joi.string().uri()).optional(),
  thumbnail: Joi.string().uri().required(),
});

module.exports = productValidationSchema;
