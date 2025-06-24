// pages/api/orders/index.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";


export default async function handler(req, res) {
  await connectDB();

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    // Get orders only for this user
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  }

  if (req.method === "POST") {
    const { items, totalPrice } = req.body;
    if (!items || !totalPrice)
      return res.status(400).json({ message: "Missing order data" });

    // Save order with userId
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  }

  res.status(405).json({ message: "Method not allowed" });
}
