import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  amount: { type: Number, required: true },
  address: {
    fullName: String,
    phoneNumber: String,
    area: String,
    city: String,
    state: String,
  },
  paymentMethod: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
