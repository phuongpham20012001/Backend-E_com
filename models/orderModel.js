const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  items: {
    type: Map,
    of: Number,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
