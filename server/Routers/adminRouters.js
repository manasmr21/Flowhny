const express = require("express");
const adminRouter = new express.Router();
const adminMiddleware = require("../middleware/adminAuthentication");

const controller = require("../Controllers/adminControllers")

adminRouter.get("/api/admin", controller.requestAdminRoute);
// adminRouter.post("/api/admin/create", controller.createAdmin);
adminRouter.post("/api/admin/loginAdmin", controller.loginAdmin);
adminRouter.post("/api/admin/logoutAdmin", adminMiddleware, controller.logoutAdmin);
adminRouter.get("/api/admin/verifyAdmin", adminMiddleware, controller.verifyAdminLogin);

module.exports = adminRouter