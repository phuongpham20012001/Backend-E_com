const authController = require("./../controllers/authController.js");
const express = require("express");
const router = express.Router();
const orderController = require("./../controllers/orderController.js");
router.route("/orderadmin") .get(
  authController.protect,
  authController.restrictTo("admin"),
  orderController.viewOrderAdmin
);
router
  .route("/order")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    orderController.viewOrder
  )
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrder
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.updateOrderStatus
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.deleteOrder
  );

module.exports = router;
