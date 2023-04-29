const authController = require("./../controllers/authController.js");
const express = require("express");
const router = express.Router();
const cloudinary = require("./../ulti/cloudinary");
const productController = require("./../controllers/productController.js");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["png", "jpg", "jpeg"],
});
var parser = multer({ storage });
router
  .route("/product")
  .get(productController.product)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    parser.single("image"),
    productController.createProduct
  )
  
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct
  );
module.exports = router;
