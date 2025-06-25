import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { products, amount, address } = await req.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Products are required" }, { status: 400 });
    }
    if (!amount || typeof amount !== "number") {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }
    if (
      !address ||
      typeof address !== "object" ||
      Array.isArray(address) ||
      !address.fullName ||
      !address.phoneNumber ||
      !address.area ||
      !address.city
    ) {
      return NextResponse.json({ error: "Valid address object is required" }, { status: 400 });
    }

    console.log("Creating order for user:", user.id);
    console.log("Order data:", { products, amount, address });

    const order = new Order({
      userId: user.id,
      products,
      amount,
      address,
      paymentMethod: "COD",  
      status: "pending", 
      createdAt: new Date(),
    });

    await order.save();

    return NextResponse.json({ message: "Order created", orderId: order._id });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
