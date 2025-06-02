const userDb = require("../Schema/userSchema");
const throwError = require("../utils/errorHandler");
const bcrypt = require("bcryptjs")
const { sendAdminRouteMail } = require("../sendMail/sendMail");
const dotenv = require("dotenv");
const adminDb = require("../Schema/adminSchema");

dotenv.config();

function generateRandomString(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}


//Request for admin route
exports.requestAdminRoute = async (req, res) => {
  try {
    const adminMail = process.env.admin;

    console.log(adminMail)

    const admin = await adminDb.findOne({  adminMail });
  
    if (admin.role == "admin") {
      const route = generateRandomString(20);
      sendAdminRouteMail(adminMail, route);

      admin.route = route;

      await admin.save()

      res.status(200).json({
        success: true,
        message: "Check your email to get the admin route.",
      });
    } else {
      throwError("Unauthorized, User is not an admin.", 401);
    }
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error providing route",
    });
  }
};


//Login to admin panel
exports.loginAdmin = async (req, res) => {
  try {
    const { adminMail, password, adminRoute } = req.body;

    const admin = await adminDb.findOne({ adminMail });

    if (!adminMail || !password) {
      throwError("Please enter valid credentials", 400);
    }

    console.log(admin.route)

    if(adminRoute !== admin.route){
      throwError("This page is not authorized.", 401);
    }

    const matchAdminPassword = await bcrypt.compare(password, admin.password);

    if (!matchAdminPassword) {
      throwError("Invalid credentials. Please try again", 401);
    }

    const token = await admin.generateAdminToken();
    admin.route = null;

    await admin.save();

    res.cookie("anotherToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res
      .status(200)
      .json({ success: true, message: "Admin logged in successfully", admin: {
        ...admin._doc,
        password: undefined,
        route: undefined, 
        token: undefined
      } });
  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error providing route",
    });
  }
};


//Logout admin
exports.logoutAdmin = async (req, res) => {
  try {
    const adminID = req._id;

    const validateAdmin = await adminDb.findOne({ _id: adminID });

    if (!validateAdmin) {
      throwError("Error admin not found", 404);
    }

    validateAdmin.token = null;

    await validateAdmin.save();

    res
      .status(200)
      .json({ success: true, message: "Admin Logged out successfully" });

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error providing route",
    });
  }
};

//verify if the admin is logged in
exports.verifyAdminLogin = async (req, res)=>{
  try {
    const _id = req._id

    const admin = await adminDb.findOne({_id});

    if(!admin){
      throwError("Admin not logged in.", 401);
    }

    res.status(200).json({success: true, message: "Admin logged in", admin: {
      ...admin._doc,
      password: undefined,
      token: undefined,
      route: undefined
    }})

  } catch (error) {
    return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error providing route",
    });
  }
}

// Make an admin Account 
// exports.createAdmin = async (req, res) => {
//   try {
//     const { adminMail, password } = req.body;

//     const adminExist = await adminDb.find();

//     if (adminExist.length > 0) {
//       throwError(
//         "There is already an admin exists. You cannot create new admin.",
//         401
//       );
//     }

//     const admin = await new adminDb({
//       adminID: "admin-A964DM98I76N",
//       adminMail,
//       password,
//       role: "admin",
//     });

//     await admin.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Admin Created successfully" });
//   } catch (error) {
//     return res.status(error.status || 400).json({
//       success: false,
//       message: error.message || "Error providing route",
//     });
//   }
// };