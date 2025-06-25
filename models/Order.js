import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "N/A" },
  },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
