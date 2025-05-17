const jwt = require("jsonwebtoken");
const adminDb = require("../Schema/adminSchema");
const key = process.env.adminSecreteKey;

const adminMiddleware = async (req, res, next) => {
  try {
    
    const token = req.cookies.anotherToken;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Try to verify token
    const verifyUser = jwt.verify(token, key);

    const rootUser = await adminDb.findOne({ _id: verifyUser._id, "token": token });

    if (!rootUser) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.token = token;
    req.rootUser = rootUser;
    req._id = rootUser._id;

    next();
  } catch (error) {
     return res.status(error.status || 400).json({
      success: false,
      message: error.message || "Error authorizing using auth token",
    });
  }
};

module.exports = adminMiddleware