const jwt = require("jsonwebtoken");
const userDb = require("../Schema/userSchema"); // adjust path as needed
const key = process.env.auth_token_key;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Try to verify token
    const verifyUser = jwt.verify(token, key);

    const rootUser = await userDb.findOne({ _id: verifyUser._id, "tokens.token": token });

    if (!rootUser) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.token = token;
    req.rootUser = rootUser;
    req._id = rootUser._id;

    

    next();
  } catch (error) {
    // If JWT is expired or invalid
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      try {
        const token = req.cookies.token;

        // Remove token from DB if it's invalid or expired
        await userDb.updateOne(
          { "tokens.token": token },
          { $pull: { tokens: { token } } }
        );
      } catch (cleanupError) {
        console.error("Error cleaning up token:", cleanupError.message);
      }

      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        error: error.message,
      });
    }

    // Other unexpected errors
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

module.exports = authenticate