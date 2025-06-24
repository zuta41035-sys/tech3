// pages/api/admin/orders/[orderId].js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { orderId } = req.query;

  if (req.method === "PUT") {
    try {
      const { status } = req.body;
      
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}