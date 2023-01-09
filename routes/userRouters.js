const authController = require("./../controllers/authController.js");
const userController = require("./../controllers/userController.js");
const express = require("express");
const router = express.Router();
const productController = require("./../controllers/productController.js");
const orderController = require("./../controllers/orderController.js");
//authController
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router
  .route("/order")
  .get(orderController.viewOrder)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrder
  );
router.route("/product").get(productController.product);
router
  .route("/updatePassword")
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    authController.updatePassword
  );
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
// userController
router
  .route("/user")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    userController.userData
  );
router.route("/updateMe").patch(
  authController.protect,

  userController.updateMe
);
router.route("/deleteMe").get(
  authController.protect,

  userController.deleteMe
);
module.exports = router;
