const order = require("./../models/orderModel");
exports.viewOrder = async (req, res) => {
  try {
    console.log(req.user._id)
    const data = await order.aggregate([
      { $match: { customerId: req.user._id } },
      {
        $project: {
          _id: 0,
          customerId: 1,
          totalAmount: 1,
          status: 1,
          items: { $objectToArray: "$items" },
        },
      },
      { $unwind: "$items" },
      {
        $project: {
          customerId: 1,
          totalAmount: 1,
          status: 1,
          // phải compare ObjectID với ObjectID.
          itemId: { $toObjectId: "$items.k" },
          quantity: "$items.v",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "itemId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          customerId: 1,
          totalAmount: 1,
          status: 1,
          item: {
            name: "$productDetails.name",
            image: "$productDetails.image",
            quantity: "$quantity",
          },
        },
      },
      {
        $group: {
          _id: {
            customerId: "$customerId",
            totalAmount: "$totalAmount",
            status: "$status",
          },
          items: { $push: "$item" },
        },
      },
    ]);

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
    res.status(500).json(err.message);
  }
};


exports.viewOrderAdmin = async (req, res) => {
  try {
    const data = await order.aggregate([
      {
        $project: {
          _id: 0,
          customerId: 1,
          totalAmount: 1,
          status: 1,
          items: { $objectToArray: "$items" },
        },
      },
      { $unwind: "$items" },
      {
        $project: {
          customerId: 1,
          totalAmount: 1,
          status: 1,
          itemId: { $toObjectId: "$items.k" },
          quantity: "$items.v",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "itemId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          customerId: 1,
          totalAmount: 1,
          status: 1,
          item: {
            name: "$productDetails.name",
            image: "$productDetails.image",
            quantity: "$quantity",
          },
        },
      },
      {
        $group: {
          _id: {
            customerId: "$customerId",
            totalAmount: "$totalAmount",
            status: "$status",
          },
          items: { $push: "$item" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.customerId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
         
          totalAmount: "$_id.totalAmount",
          status: "$_id.status",
          items: 1,
          userName: "$userDetails.name",
        },
      },
    ]);
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
