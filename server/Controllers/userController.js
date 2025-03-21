const userDb = require("../Schema/userSchema")
const throwError = require("../utils/errorHandler")
const createUserIDGenerator = require("../userID");
const CryptoJS = require("crypto-js")
const {sendVerificationCode} = require("../sendMail/sendMail")

//Environmental Variable
const dotenv = require("dotenv")
dotenv.config()

// Store pending registrations temporarily
const pendingRegistrations = new Map();

//Send mail for user verification
const sendMailsForVerification = async (email) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
    
    await sendVerificationCode(email, verificationCode);
    return { verificationCode, expiresAt };
}

//Fetch a user
exports.fetchUser = async(req,res)=>{
    try {
        const users =await userDb.find()
        res.status(200).json({success : true, users})
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

//User Registration API
exports.register = async (req, res)=>{
    try {
        // const {data} = req.body;
        // const SECRET_KEY = process.env.SECRET_KEY
        // const bytes =  CryptoJS.AES.decrypt(data, SECRET_KEY);
        // const decryptedData =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        const {username, useremail, password, cpassword} = req.body;
    
        if(!username || !useremail || !password || !cpassword){
           throwError("Please fill all the required fields", 400);
        }

        if(password != cpassword){
            throwError("Confirm your password, please...")
        }

        if(password.length < 5){
            throwError("Please enter a valid password", 400);
        }
        
        const preuser = await userDb.findOne({useremail});

        if(preuser){
            throwError("This email is already registered.", 400);
        }

        let userID;
        do {
          userID = createUserIDGenerator();
        } while (await userDb.findOne({ userID }));

        // Generate and send verification code
        const { verificationCode, expiresAt } = await sendMailsForVerification(useremail);
        
        // Store pending registration
        pendingRegistrations.set(useremail, {
            username,
            useremail,
            password,
            userID,
            verificationCode,
            expiresAt,
        });

        res.status(200).json({
            success: true,
            message: "Verification code sent to your email",
            email: useremail,
            verificationCode
        });
       
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

// Verify Email API
exports.verifyEmail = async (req, res) => {
    try {
        const { useremail, code } = req.body;
        
        const pendingUser = pendingRegistrations.get(useremail);
        

        if (!pendingUser) {
            throwError("No pending registration found for this email", 400);
        }

        if (Date.now() > pendingUser.expiresAt) {
            pendingRegistrations.delete(useremail);
            throwError("Verification code has expired. Please register again.", 400);
        }

        if (code !== pendingUser.verificationCode) {
            throwError("Invalid verification code", 400);
        }

        // Create verified user in database
        const newUser = await new userDb({
            username: pendingUser.username,
            useremail: pendingUser.useremail,
            password: pendingUser.password,
            userID: pendingUser.userID,
            verified: true
        });

        await newUser.save();
        
        // Clear pending registration
        pendingRegistrations.delete(useremail);

        const user = await userDb.findOne({useremail})

        await user.generateAuthToken()

        await user.save()

        res.status(201).json({
            success: true,
            message: "Email verified successfully. Account created",
            user: {
                ...user._doc,
                password: undefined
            },
        });

    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { userID } = req.params;

        if (!userID) {
            throwError("User ID is required", 400);
        }

        const user = await userDb.findOne({ userID });
        
        if (!user) {
            throwError("User not found", 404);
        }

        await userDb.deleteOne({ userID });

        res.status(200).json({ 
            success: true, 
            message: "User deleted successfully" 
        });

    } catch (error) {
        return res.status(error.status || 400).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { data } = req.body;
        const { useremail, password } = data;

        if (!useremail || !password) {
            throwError("Please provide both email and password", 400);
        }

        const user = await userDb.findOne({ useremail });
        
        if (!user) {
            throwError("User not found. Please check your email.", 404);
        }

        // Compare password (assuming it's stored as plain text for now)
        // TODO: Add password hashing in a future update
        if (user.password !== password) {
            throwError("Invalid password", 401);
        }

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        });

    } catch (error) {
        return res.status(error.status || 400).json({ message: error.message });
    }
}
