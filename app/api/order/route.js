import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db"; 
import Order from "@/models/Order"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products, amount, address } = await req.json();

    await connectDB();

    const order = new Order({
      userId: user.id,
      products,
      amount,
      address,
      status: "Processing",
      createdAt: new Date(),
    });

    const savedOrder = await order.save();

    return NextResponse.json({ message: "Order created", orderId: savedOrder._id });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch orders for the current user
    const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
