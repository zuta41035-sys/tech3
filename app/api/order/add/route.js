import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  await connectDB();

  try {
    const body = await request.json();

    const {
      userId,
      items,
      amount,
      address,
      date,
      paymentMethod,
      paymentStatus,
    } = body;

    if (!userId || !items || !amount || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required order data" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      userId,
      products: items,
      amount: amount,
      address,
      createdAt: date || new Date(),
      paymentMethod,
      status: paymentStatus || "Pending",
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({ success: true, order: savedOrder }, { status: 201 });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    // Extract userId from Clerk auth token in request headers
    const { userId } = getAuth({ headers: request.headers });
    console.log("User ID from auth:", userId);

    if (!userId) {
      console.log("Unauthorized: no userId");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find orders for this user, newest first
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
