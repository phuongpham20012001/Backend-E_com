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
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  status: { type: String, required: true },
});
const OrderModel = mongoose.model("order", OrderSchema);

module.exports = OrderModel;
