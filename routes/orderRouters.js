const authController = require("./../controllers/authController.js");
const express = require("express");
const router = express.Router();
const orderController = require("./../controllers/orderController.js");
router
  .route("/order")
  .get(orderController.viewOrder)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    orderController.createOrder)
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
router
  .route("/order/status")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    orderController.orderStatus
  );
module.exports = router;
