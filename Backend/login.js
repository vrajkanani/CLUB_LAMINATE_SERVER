const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  userName:String,
  password:String
});

const LoginModel = mongoose.model("login_datas", LoginSchema);
module.exports=LoginModel