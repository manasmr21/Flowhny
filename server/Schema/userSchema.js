const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//Address Schema

const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: Number,
    required: true,
    match: /^[0-9]{10,15}$/,
  },
  addressLine1:{
    type: String, 
    required: true
  },
  addressLine2:{
    type: String
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: Number,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'India'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});


//User schema
const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    useremail: {
        type: String,
        trim:true,
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
        minlength: 5,
    },
    addresses: [addressSchema],
    orders:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
      }
    ],
    verified: {
        type: Boolean,
        default: false,
    },
    role:{
      type: String,
      required: true,
      enum: ["user", "admin", "delivery"],
      default: "user"
    },
    resetPasswordRoute: {
      type: String,
      unique: true,
      sparse: true
    },
    resetPasswordRouteExpiresAt: Date,
    verificationCode: String,
    verificationCodeExpiresAt : Date,
    failedAttempts:{
      type: Number,
      default: 0
    },
    timeout:Date,
    tokens: [
        {
          token: {
            type: String,
            required: true,
          }, 
        },
      ],

}, { timestamps: true })


const autheSecreteKey = process.env.auth_token_key

//Generating authentication token
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({_id: this._id}, autheSecreteKey)

        this.tokens = this.tokens.concat({token})

        await this.save()
        return token
    } catch (error) {
        console.log(error.message)
        return error.message
    }
}

//Password hasing
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        try {
            this.password = await bcryptjs.hash(this.password, 10)
            next()
        } catch (error) {
            next(error)
        }
    }else{
        next()
    }
})

const userDb = new mongoose.model("users", userSchema);

module.exports = userDb;