const product = require("./../models/productModel");
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
