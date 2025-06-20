const express = require("express");
const router = new express.Router();
const authenticate = require("../middleware/authentication");
const adminMiddleware = require("../middleware/adminAuthentication");
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
router.post("/api/authentication/add-address",authenticate, controller.userAddress);
router.post("/api/authentication/verify",authenticate, controller.verifyAuth);
router.post("/api/authentication/update-username", authenticate, controller.updateUser);
router.patch("/api/authentication/update-email",authenticate, controller.updateEmail);
router.delete("/api/authentication/deleteUser/:userID", authenticate, controller.deleteUser);
router.delete("/api/authentication/deleteAddress/:addressID", authenticate, controller.deleteAddress);
router.post("/api/authentication/updateAddress", authenticate, controller.updateAddress);

//Product Routers
router.get("/api/product/fetch-product",  productController.fetchAllProduct);
router.get("/api/product/fetch-single-product", productController.fetchOneProduct);
router.post("/api/product/add-product", adminMiddleware, productController.addProduct);
router.patch("/api/product/update-product", adminMiddleware, productController.updateProduct);
router.delete("api/product/delete-product", adminMiddleware, productController.deleteProduct);

//Order Routers
router.post("/api/orders/make-order", authenticate, orderController.makeOrder);
router.post("/api/orders/cancel-order", authenticate, orderController.cancelOrder);
router.get("/api/orders/fetch-orders",authenticate, orderController.getOrder);


module.exports = router