const express = require("express")
const router = new express.Router()

//controllers
const controller = require("../Controllers/userController")

//User Routers
router.get("/api/authentication/fetch-user", controller.fetchUser)
router.post("/api/authentication/register", controller.register);
router.post("/api/authentication/verify-email", controller.verifyEmail);
router.post("/api/authentication/resend-verification-code", controller.resendVerificationCode);
router.post("/api/authentication/login", controller.login)
router.delete("/api/authentication/deleteUser/:userID", controller.deleteUser);

//Product Routers

module.exports = router