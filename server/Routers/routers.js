const express = require("express");
const router = new express.Router();
const authenticate = require("../middleware/authentication");
const adminMiddleware = require("../middleware/adminAuthentication");
//controllers
const controller = require("../Controllers/userController");
const productController = require("../Controllers/productController");
const orderController = require("../Controllers/orderController");
const upload = require("../utils/multer");

const uploadImages = upload.fields([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

//User Routers
router.get("/api/authentication/fetch-user", controller.fetchUser);
router.post("/api/authentication/register", controller.register);
router.post("/api/authentication/verify-email", controller.verifyEmail);
router.post(
  "/api/authentication/resend-verification-code",
  controller.resendVerificationCode
);
router.post("/api/authentication/login", controller.login);
router.post("/api/authentication/logout", authenticate, controller.logout);
router.post(
  "/api/authentication/add-address",
  authenticate,
  controller.userAddress
);
router.post("/api/authentication/verify", authenticate, controller.verifyAuth);
router.post(
  "/api/authentication/update-username",
  authenticate,
  controller.updateUser
);
router.patch(
  "/api/authentication/update-email",
  authenticate,
  controller.updateEmail
);
router.delete(
  "/api/authentication/deleteUser/:userID",
  authenticate,
  controller.deleteUser
);
router.delete(
  "/api/authentication/deleteAddress/:addressID",
  authenticate,
  controller.deleteAddress
);
router.post(
  "/api/authentication/updateAddress",
  authenticate,
  controller.updateAddress
);
router.post(
  "/api/authentication/forgot-password",
  controller.sendForgotPasswordRoute
);
router.post(
  "/api/authentication/forgot-password/:resetPasswordRoute",
  controller.resetPassword
);

//Product Routers
router.get("/api/product/fetch-product", productController.fetchAllProduct);
router.get(
  "/api/product/fetch-single-product",
  productController.fetchOneProduct
);
router.post(
  "/api/product/add-product",
  adminMiddleware,
  uploadImages,
  productController.addProduct
);
router.patch(
  "/api/product/update-product",
  adminMiddleware,
  productController.updateProduct
);
router.delete(
  "/api/product/delete-product",
  adminMiddleware,
  productController.deleteProduct
);
router.get("/product/:fileName", productController.showImage);

//Test multer
// router.post("/test-multer", , productController.testMulter);

//Order Routers
router.post("/api/orders/make-order", authenticate, orderController.makeOrder);
router.post(
  "/api/orders/cancel-order",
  authenticate,
  orderController.cancelOrder
);
router.get("/api/orders/fetch-orders", authenticate, orderController.getOrder);

module.exports = router;
