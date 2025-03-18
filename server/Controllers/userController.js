const userDb = require("../Schema/userSchema")
const throwError = require("../utils/errorHandler")
const createUserIDGenerator = require("../userID");

exports.register = async (req, res)=>{

    try {
        const {data} = req.body;

        const {username,useremail, password, cpassword} = data;
    
        
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