const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  customerId: {
    type: "string",
    required: true,
  },
  totalAmount: {
    type: "number",
    required: true,
  },
  items: {
    type: Map,
    of: Number,
    required: true,
  },
  status:  {type: String},
});
const OrderModel = mongoose.model("order", OrderSchema);

module.exports = OrderModel;
