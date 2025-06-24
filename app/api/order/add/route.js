import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  await connectDB();

  try {
    const { userId } = getAuth({ headers: request.headers });
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received order data:", body); // Debug log

    const { products, amount, address, paymentMethod } = body; // Changed from 'items' to 'products'

    if (!products || !amount || !address || !paymentMethod) {
      console.log("Missing data:", { products: !!products, amount: !!amount, address: !!address, paymentMethod: !!paymentMethod });
      return NextResponse.json(
        { message: "Missing required order data" },
        { status: 400 }
      );
    }

    const newOrder = new Order({
      userId,
      products: products,     // Changed from 'items' to 'products'
      amount: amount,         // Changed from 'totalAmount' to 'amount'
      address,
      paymentMethod,
      // Removed paymentStatus - not in schema
      // Removed createdAt - schema has default
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json({ success: true, order: savedOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}