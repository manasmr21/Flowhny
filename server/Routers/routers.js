const express = require("express")
const router = new express.Router()

//controllers
const controller = require("../Controllers/userController")


router.get("/api/authentication/fetch-user", controller.fetchUser)
router.post("/api/authentication/register", controller.register);
router.post("/api/authentication/verify", controller.verifyEmail);
router.delete("/api/authentication/deleteUser/:userID", controller.deleteUser);

module.exports = router