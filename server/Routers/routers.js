const express = require("express");
const router = new express.Router();
const authenticate = require("../middleware/authentication");

//controllers
const controller = require("../Controllers/userController")
const productController = require("../Controllers/productController");
const orderController = require("../Controllers/orderController");

//User Routers
router.get("/api/authentication/fetch-user", controller.fetchUser)
router.post("/api/authentication/register", controller.register);
router.post("/api/authentication/verify-email", controller.verifyEmail);
router.post("/api/authentication/resend-verification-code", controller.resendVerificationCode);
router.post("/api/authentication/login", controller.login);
router.post("/api/authentication/logout",authenticate, controller.logout);
router.post("/api/authentication/add-details",authenticate, controller.userAddress);
router.post("/api/authentication/verify",authenticate, controller.verifyAuth);
router.post("/api/authentication/update-username", authenticate, controller.updateUser);
router.patch("/api/authentication/update-email",authenticate, controller.updateEmail);
router.delete("/api/authentication/deleteUser/:userID", authenticate, controller.deleteUser);

//Product Routers
router.get("/api/product/fetch-product", productController.fetchAllProduct);
router.get("/api/product/fetch-single-product", productController.fetchOneProduct);
router.post("/api/product/add-product", productController.addProduct);

//Order Routers
router.post("/api/orders/make-order", authenticate, orderController.makeOrder);
router.post("/api/orders/cancel-order", orderController.cancelOrder);
router.get("/api/orders/fetch-orders", orderController.getOrder);


module.exports = router