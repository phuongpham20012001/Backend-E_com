const order = require("./../models/orderModel");
exports.viewOrder = async (req, res) => {
  try {
    const data = await order.find();
    // SEND RESPONSE
    if (data.length > 0) {
      res.status(200).json({
        status: "success",
        data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Do not have any orders available",
      });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};
exports.createOrder = async (req, res) => {
  try {
    await order.create({
      customerId: req.body.customerId,
      totalAmount: req.body.totalAmount,
      items: req.body.items,
      status: req.body.status,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json(err.message);
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    await order.findByIdAndUpdate(req.body.id, req.body.status, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (e) {
    res.status(500).json(err.message);
  }
};
exports.deleteOrder = async (req, res) => {
    try {
      await order.findByIdAndDelete(req.body.id);
      res.status(200).json({
        status: "success",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  