import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { orderStatus } = await request.json();

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    
    if (!validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedOrder = await Order.findOneAndUpdate(
      { 
        $or: [
          { _id: id },
          { orderId: id }
        ]
      },
      { 
        orderStatus,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      message: "Order status updated successfully"
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}