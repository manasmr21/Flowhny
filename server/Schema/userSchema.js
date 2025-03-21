const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose
const validator = require("validator");


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
    verified: {
        type: Boolean,
        default: false,
    },
    isLoggedin: {
        type: Boolean,
        default: false,
    },
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
        const token = jwt.sign({_id: this._id}, autheSecreteKey, {
            expiresIn : "1d"
        })

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

const userDb = new mongoose.model("users", userSchema)

module.exports = userDb