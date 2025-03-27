const Joi = require("joi");

// Address validation schema
const addressSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  addressLine1: Joi.string().trim().required(),
  addressLine2: Joi.string().trim().allow("").optional(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
  country: Joi.string().trim().default("India"),
  isDefault: Joi.boolean().default(false),
});

// User validation schema
const userValidationSchema = Joi.object({
  username: Joi.string().trim().required(),
  useremail: Joi.string().trim().email().required(),
  password: Joi.string().min(5).required(),
  cpassword: Joi.string().valid(Joi.ref('password')).required().messages({
  'any.only': 'Confirm password must match password',
}),
  terms: Joi.boolean().valid(true).required(),
  addresses: Joi.array().items(addressSchema).optional(),
  verified: Joi.boolean().default(false),
  verificationCode: Joi.string().optional(),
  verificationCodeExpiresAt: Joi.date().optional(),
  tokens: Joi.array()
    .items(
      Joi.object({
        token: Joi.string().required(),
      })
    )
    .optional(),
});

module.exports = { userValidationSchema, addressSchema };
