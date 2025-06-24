// pages/api/admin/orders.js
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    try {
      // Get ALL orders from ALL users
      const orders = await Order.find({}).sort({ createdAt: -1 });
      
      // Get user details for each order
      const ordersWithUserData = await Promise.all(
        orders.map(async (order) => {
          try {
            // Get user info from Clerk
            const user = await clerkClient.users.getUser(order.userId);
            return {
              ...order.toObject(),
              customerName: user.firstName + " " + user.lastName,
              customerEmail: user.emailAddresses[0]?.emailAddress,
              customerPhone: user.phoneNumbers[0]?.phoneNumber || "Not provided"
            };
          } catch (error) {
            // If user not found, return order with basic info
            return {
              ...order.toObject(),
              customerName: "Unknown User",
              customerEmail: "Not available",
              customerPhone: "Not available"
            };
          }
        })
      );

      return res.status(200).json(ordersWithUserData);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}