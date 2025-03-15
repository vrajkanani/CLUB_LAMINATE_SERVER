const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  mobileNo: String,
  city: String,
  ProductName :String,
  quantity: Number,
  state: String,
  pincode: String,
  orderDate: Date,
  address: String,
});

const UserModel = mongoose.model("form_datas", UserSchema);
module.exports=UserModel