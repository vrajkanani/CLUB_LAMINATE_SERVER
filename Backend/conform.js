const mongoose = require("mongoose");

const ConformSchema = new mongoose.Schema({
  fullName: String,
  mobileNo: String,
  city: String,
  ProductName : String,
  quantity: Number,
  state: String,
  pincode: String,
  orderDate: Date,
  address: String,
});

const Conform = mongoose.model("conform_orders", ConformSchema);
module.exports=Conform