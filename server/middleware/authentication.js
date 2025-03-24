const jwt = require("jsonwebtoken")
const userDb = require("../Schema/userSchema")
const dotenv = require("dotenv")

const key = process.env.auth_token_key

const authenticate = async(req,res,next)=>{
    try {
        const token = await req.headers.authorization

    const verifyUser = jwt.verify(token, key)

    const rootUser = await userDb.findOne({_id : verifyUser._id})

    req.token = token;
    req.rootUser = rootUser;
    req._id = rootUser._id

    next();
    
    } catch (error) {
        return res.status(401).json({success : false, message:  "User not logged in", error : error.message })    
    }
}

module.exports = authenticate