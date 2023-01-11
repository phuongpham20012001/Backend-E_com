const authController = require("./../controllers/authController.js");
const userController = require("./../controllers/userController.js");
const express = require("express");
const router = express.Router();
//authController
router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
// update password
router
  .route("/updatePassword")
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    authController.updatePassword
  );
// reset by password by email
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);
// user infor and update
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
