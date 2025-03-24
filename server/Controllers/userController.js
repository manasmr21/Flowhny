const userDb = require("../Schema/userSchema");
const throwError = require("../utils/errorHandler");
const createUserIDGenerator = require("../utils/userID");
const CryptoJS = require("crypto-js");
const { sendVerificationCode } = require("../sendMail/sendMail");
const bcrypt = require("bcryptjs");
const {
  userValidationSchema,
  addressSchema,
} = require("../validators/userValidator");

//Environmental Variable
const dotenv = require("dotenv");
dotenv.config();

//Send mail for user verification
const sendMailsForVerification = (email) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const expiresAt = Date.now() + 60 * 1000;

  sendVerificationCode(email, verificationCode);
  return { verificationCode, expiresAt };
};

//Fetch a user
exports.fetchUser = async (req, res) => {
  try {
    const users = await userDb.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error fetching user",
    });
  }
};

//User Registration API
exports.register = async (req, res) => {
  try {
    const { data } = req.body;
    const SECRET_KEY = process.env.SECRET_KEY;

    //Decrypting the code sent from the frontend
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { username, useremail, password, cpassword } = decryptedData;

    const { error } = userValidationSchema.validate(decryptedData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((e) => e.message),
      });
    }

    //Creating a user
    const preuser = await userDb.findOne({ useremail });

    if (preuser) {
      throwError("This email is already registered.", 400);
    }

    let userID;
    do {
      userID = createUserIDGenerator();
    } while (await userDb.findOne({ userID }));

    // Generate and send verification code
    const { verificationCode, expiresAt } = sendMailsForVerification(useremail);

    const newUser = new userDb({
      username,
      useremail,
      password,
      userID,
      verificationCode,
      verificationCodeExpiresAt: expiresAt,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      newUser,
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to create account",
    });
  }
};

// Verify Email API
exports.verifyEmail = async (req, res) => {
  try {
    const { useremail, code } = req.body;

    let user = await userDb.findOne({ useremail });

    if (!user) {
      throwError("User does not exist", 404);
    }

    if (Date.now() > user.verificationCodeExpiresAt) {
      throwError("Verification code has expired.", 400);
    }

    if (code !== user.verificationCode) {
      throwError("Invalid verification code", 400);
    }

    await user.generateAuthToken();

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    user.isLoggedin = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Verification failed",
    });
  }
};

// Resend verification code
exports.resendVerificationCode = async (req, res) => {
  try {
    const { useremail } = req.body;

    const user = await userDb.findOne({ useremail });

    if (user && !user.verified) {
      const { verificationCode, expiresAt } =
        sendMailsForVerification(useremail);
      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = expiresAt;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed to resend verification code",
    });
  }
};

//Add user details
exports.userDetails = async (req, res) => {
  try {
    const userID = req._id
    const { address } = req.body;

    const findUser = await userDb.findOne({ _id: userID });

    const { error } = addressSchema.validate(address, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(e=>e.message),
      });
    }

    if (!findUser) {
      throwError("Error finding the user.", 404);
    }else if(!findUser.verified){
      throwError("Please verify your email before proceeding", 400)
    }

    findUser.addresses.push(address)

    await findUser.save();

    res.status(201).json({success: true, message: "Address added successfully"});

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error adding more details",
    });
  }
};

//TODO: Modify it for user . this code is for admin only
//Delete the user
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
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Failed deleting the user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // const { data } = req.body;
    const { useremail, password } = req.body;

    if (!useremail || !password) {
      throwError("Please provide both email and password", 400);
    }

    const user = await userDb.findOne({ useremail });

    if (!user) {
      throwError("User not found. Please check your email.", 404);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throwError("");
    }

    user.isLoggedin = true;

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ success: false, message: error.message || "Failed to log in" });
  }
};
