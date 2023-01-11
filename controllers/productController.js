const product = require("./../models/productModel");
const cloudinary = require("./../ulti/cloudinary");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.product = async (req, res) => {
  try {
    const data = await product.find();
    // SEND RESPONSE
    if (data.length > 0) {
      res.status(200).json({
        status: "success",
        data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Do not have any products available",
      });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};
exports.createProduct = async (req, res) => {
  try {
    console.log(req.body)
    await product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.path,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};
exports.updateProduct = async (req, res) => {
  try {
    
    const updatedProduct = await product.findByIdAndUpdate(
      req.body.id,
      {
        name : req.body.name,
        price : req.body.price,
        description : req.body.description,
        image : req.file.path
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      updatedProduct,
    });
  } catch (e) {
    res.status(500).json(err.message);
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    await product.findByIdAndDelete(req.body.id);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
