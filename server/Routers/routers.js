const express = require("express")
const router = new express.Router()

//controllers
const controller = require("../Controllers/userController")



router.post("/api/authentication/register", controller.register);
router.post("/api/authentication/login", controller.login);
router.delete("/api/authentication/deleteUser/:userID", controller.deleteUser);

module.exports = router