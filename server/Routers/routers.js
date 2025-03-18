const express = require("express")
const router = new express.Router()

//controllers
const controller = require("../Controllers/userController")



router.post("/api/authentication/register", controller.register);

module.exports = router