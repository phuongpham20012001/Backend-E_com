const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required : [true, 'Please add a product Name'],
    maxlength: 32
},

description: {
    type: String,
    trim: true,
    required : [true, 'Please add a product Description'],
    maxlength: 2000,
},

price: {
    type: Number, 
    trim: true,
    required : [true, 'Product must have a price'],
    maxlength: 32
},
  image: {
    type: "string",
    required: true,
  },
});
const ProductModel = mongoose.model("product", ProductSchema);

module.exports = ProductModel;
