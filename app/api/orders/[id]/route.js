import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectDB();

    const order = await Order.findOne({ 
      $or: [
        { _id: id },
        { orderId: id }
      ]
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectDB();

    const deletedOrder = await Order.findOneAndDelete({ 
      _id: id,
      userId: userId // Ensure user can only delete their own orders
    });

    if (!deletedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}