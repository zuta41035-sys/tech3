// pages/api/orders/index.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { products, totalAmount, address, paymentMethod } = req.body;

    if (!products || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: "Missing required order data" });
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      address,
      paymentMethod,
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  }

  if (req.method === "GET") {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  }

  res.status(405).json({ message: "Method not allowed" });
}
