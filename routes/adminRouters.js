const authController = require("./../controllers/authController.js");
const express = require("express");
const router = express.Router();
const productController = require("./../controllers/productController.js");
const orderController = require("./../controllers/orderController.js");
//admin
router
  .route("/product")
  .post(
    // authController.protect,
    // authController.restrictTo("admin"),
    productController.createProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );
router
  .route("/order")
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
