const order = require("./../models/orderModel");
const products = require("./../models/productModel");
exports.viewOrder = async (req, res) => {
  try {
    const data = await order.find({ customerId: req.user._id });
    for (const order of data) {
      const itemId = Array.from(order.items.keys());
      console.log(itemId);
      // const data2 = await products.find({ _id: itemId });
      // for (const product of data2) {
      //   console.log(`Name: ${product.name}`);
      //   console.log(`Image Link: ${product.image}`);
      // }
  
    }

    // SEND RESPONSE
    if (data.length > 0) {
      res.status(200).json({
        status: "success",
        data
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Do not have any orders available",
      });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};
exports.viewOrderAdmin = async (req, res) => {
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
      customerId: req.user._id,
      totalAmount: req.body.totalAmount,
      items: req.body.items,
      status: "Pending",
    });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
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
// have not tested
exports.orderStatus = async (req, res) => {
  try {
    const data = await order.findOne(
      { _id: req.body.id },
      { projection: { status: 1 } }
    );
    if (data.length > 0) {
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Do not have any orders status available",
      });
    }
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
