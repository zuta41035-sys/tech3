import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { products, amount, address, paymentMethod } = body;

    if (!products || !amount || !address || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required order data" },
        { status: 400 }
      );
    }

    await connectDB();

    const newOrder = new Order({
      userId,
      products,
      amount,
      address,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({ 
      success: true, 
      order: savedOrder 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}