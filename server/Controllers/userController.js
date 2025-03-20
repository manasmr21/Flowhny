const userDb = require("../Schema/userSchema")
const throwError = require("../utils/errorHandler")
const createUserIDGenerator = require("../userID");
const CryptoJS = require("crypto-js")
const dotenv = require("dotenv")
dotenv.config()


exports.register = async (req, res)=>{

    try {
        const {data} = req.body;

        const SECRET_KEY = process.env.SECRET_KEY

        const bytes =  CryptoJS.AES.decrypt(data, SECRET_KEY);

        const decryptedData =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

        const {username,useremail, password, cpassword} = decryptedData;
    
        
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

        const newUser = await userDb({
            username,
            useremail,
            password,
            userID 
        });

        await newUser.save()

        res.status(200).json({success:true, newUser: {
            ...newUser._doc,
            password: undefined
        }})

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
