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
const { message } = require("../validators/productValidator");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

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
      newUser: {
        ...newUser._doc,
        password: undefined,
        tokens: undefined,
      },
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

//Add user address
exports.userAddress = async (req, res) => {
  try {
    const userID = req._id;
    const { address } = req.body;

    const findUser = await userDb.findOne({ _id: userID });

    const { error } = addressSchema.validate(address, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((e) => e.message),
      });
    }

    if (!findUser) {
      throwError("Error finding the user.", 404);
    } else if (!findUser.verified) {
      throwError("Please verify your email before proceeding", 400);
    }

    findUser.addresses.push(address);

    await findUser.save();

    res
      .status(201)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error adding more details",
    });
  }
};

//Delete the user
exports.deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const {password} = req.body
    const _id = req._id;
    

    console.log(userID,   password);


    if (!userID) {
      throwError("User ID is required", 400);
    }

    const user = await userDb.findOne({ userID });

    console.log(_id, user._id)

    if (_id.toString() !== user._id.toString()) {
      throwError("Unauthorized to delete user", 401);
    }

    if (!user) {
      throwError("User not found", 404);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if(!matchPassword){
      throwError("Unauthorized! Password does not match", 401);
    }

    await userDb.deleteOne({ userID });

    res.clearCookie("token", {
      path: "/", 
      httpOnly: true, 
      secure: false
    });

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

//Log in the user
exports.login = async (req, res) => {
  try {
    const { data } = req.body;

    //Decrypting the code sent from the frontend
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { useremail, password } = decryptedData;

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

    const token = await user.generateAuthToken();

    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 30* 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
        tokens: undefined,
      },
    });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ success: false, message: error.message || "Failed to log in" });
  }
};

//Log out the user
exports.logout = async (req, res) => {
  try {
    const userID = req._id;
    const authToken = req.token;
    const findUser = await userDb.findOne({ _id: userID });

    if (!findUser) {
      throwError("Unauthorized user, please log in", 401);
    }

    findUser.tokens = findUser.tokens.filter((item) => {
      return item.token !== authToken;
    });

    await findUser.save();

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error logging out the user",
    });
  }
};

//Verify if user is logged in or not
exports.verifyAuth = async (req, res) => {
  try {
    const userID = req._id;

    const user = await userDb.findOne({ _id: userID });

    res.status(201).json({
      success: true,
      message: "User OK",
      user: {
        ...user._doc,
        password: undefined,
        tokens: undefined,
      },
    });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ success: false, message: error.message });
  }
};

//Update username
exports.updateUser = async (req, res) => {
  try {
    const userID = req._id;
    const updatedUser = req.body;
    const oldUser = await userDb.findOne({ _id: userID });

    if (!oldUser) {
      throwError("Error Updating the user. No such user found", 404);
    }

    console.log(updatedUser);

    oldUser.username = await updatedUser.username;

    await oldUser.save();

    res.status(200).json({
      success: true,
      message: "Details updated successfully",
      userData: {
        ...oldUser._doc,
        password: undefined,
        tokens: undefined,
      },
    });
  } catch (error) {
    return res
      .status(error.status || 400)
      .json({ success: false, message: error.message });
  }
};

//Update email address
exports.updateEmail = async (req, res) => {
  try {
    const userID = req._id;

    const user = await userDb.findOne({ _id: userID });

    const data = req.body;

    if (data.oldMail && !data.newMail && !data.code && user.useremail == data.oldMail) {
      const { verificationCode, expiresAt } = sendMailsForVerification(
        data.oldMail
      );

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = expiresAt;

      await user.save();

      res
        .status(200)
        .json({ success: true, message: `Code sent to ${data.oldMail}` });
    }

    if (data.oldMail && data.code) {
      if (data.code !== user.verificationCode) {
        throwError("Invalid code", 400);
      }

      if (Date.now() > user.verificationCodeExpiresAt) {
        throwError("Code Expired", 400);
      }

      const { verificationCode, expiresAt } = sendMailsForVerification(
        data.newMail
      );

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = expiresAt;

      await user.save();

      res
        .status(200)
        .json({ success: true, message: `Code sent to ${data.newMail}` });
    } else if (data.newMail && data.code) {
      if (data.code !== user.verificationCode) {
        throwError("Invalid code", 400);
      }

      if (Date.now() > user.verificationCodeExpiresAt) {
        throwError("Code Expired", 400);
      }

      const updatedUser = await userDb.findByIdAndUpdate(
        { _id: userID },
        {
          useremail: data.newMail,
          verificationCode: null,
          verificationCodeExpiresAt: null,
        },
        { new: true }
      );

      await updatedUser.save();

      res
        .status(200)
        .json({ success: true, message: "Email updated successfully", userData: {
        ...updatedUser._doc,
        password: undefined,
        tokens: undefined,
      } });
    }
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error updating the user",
    });
  }
};
