const mongoose = require('mongoose')
const contactSchema = new mongoose.Schema({
    id:String,
    name:String,
    email:String,
    message:String
})
const ContactModel = mongoose.model("messages", contactSchema)
module.exports=ContactModel