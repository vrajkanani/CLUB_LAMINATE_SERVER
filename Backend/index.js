require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const Conform = require("./conform.js");
const UserModel = require("./user.js");
const LoginModel = require("./login.js");
const ContactModel = require("./contactus.js");


const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3030;


mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
})
.catch((error) => {
  console.error("❌ Error connecting to MongoDB Atlas:", error.message);
});

// ================== Pending Orders ==================
app.get("/orderList", async (req, res) => {
  try {
    const form_data = await UserModel.find({});
    if (form_data.length > 0) res.json(form_data);
    else res.status(404).json({ message: "No orders found" });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/orderList/:id", async (req, res) => {
  try {
    const userData = await UserModel.findById(req.params.id);
    if (userData) res.json(userData);
    else res.status(404).json({ message: "Order not found" });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/BookNow", async (req, res) => {
  try {
    const userSchema = new UserModel(req.body);
    const saved = await userSchema.save();
    res.json(saved);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/orderList/:id", async (req, res) => {
  try {
    const deletedOrder = await UserModel.findByIdAndDelete(req.params.id);
    if (deletedOrder) res.json({ message: "Order deleted successfully" });
    else res.status(404).json({ message: "Order not found" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== Confirm Orders ==================
app.get("/conformList", async (req, res) => {
  try {
    const conform_orders = await Conform.find({});
    if (conform_orders.length > 0) res.json(conform_orders);
    else res.status(404).json({ message: "No orders found" });
  } catch (err) {
    console.error("Error fetching conform orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/conformList/:id", async (req, res) => {
  try {
    const conformData = await Conform.findById(req.params.id);
    if (conformData) res.json(conformData);
    else res.status(404).json({ message: "Order not found" });
  } catch (err) {
    console.error("Error fetching conform order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addConform", async (req, res) => {
  try {
    const orderData = req.body;

    // Remove from pending orders
    await UserModel.findByIdAndDelete(orderData._id);

    // Add to conform orders
    const conformSchema = new Conform(orderData);
    await conformSchema.save();

    res.json({ message: "Order completed successfully" });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/addConform/:id", async (req, res) => {
  try {
    const deletedOrder = await Conform.findByIdAndDelete(req.params.id);
    if (deletedOrder) res.json({ message: "Order deleted successfully" });
    else res.status(404).json({ message: "Order not found" });
  } catch (error) {
    console.error("Error deleting conform order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== Contact Us ==================
app.get("/messages", async (req, res) => {
  try {
    const messages = await ContactModel.find({});
    if (messages.length > 0) res.json(messages);
    else res.status(404).json({ message: "No messages found" });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/send-message", async (req, res) => {
  try {
    const contactSchema = new ContactModel(req.body);
    const savedContact = await contactSchema.save();
    res.json(savedContact);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send("Error saving message");
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    const deletedMessage = await ContactModel.findByIdAndDelete(req.params.id);
    if (deletedMessage) res.json({ message: "Message deleted successfully" });
    else res.status(404).json({ message: "Message not found" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== Login ==================
app.get("/login", async (req, res) => {
  try {
    const login_datas = await LoginModel.find({});
    if (login_datas.length > 0) res.json(login_datas);
    else res.status(404).json({ message: "No users found" });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/forgot", async (req, res) => {
  try {
    if (req.body.userName && req.body.password) {
      let admin = await LoginModel.findOne(req.body);
      if (admin) res.json({ admin, adminId: admin._id });
      else res.json({ msg: "Not found" });
    } else {
      res.status(400).json({ msg: "Invalid request" });
    }
  } catch (error) {
    console.error("Error in forgot route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ================== Start Server ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

