const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config()

const adminSchema = new mongoose.Schema(
  {
    adminID: {
      type: String,
      unique: true,
      required: true,
    },
    adminMail: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    route: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const autheSecreteKey = process.env.adminSecreteKey

//Generating authentication token
adminSchema.methods.generateAdminToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, autheSecreteKey);

    this.token = token;

    
    await this.save();
    return token;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

//Password hasing
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcryptjs.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const adminDb = new mongoose.model("admins", adminSchema);

module.exports = adminDb;
