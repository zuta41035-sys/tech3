// /app/api/order/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  await connectDB();

  try {
    console.log("Headers received:", JSON.stringify(request.headers));

    const { userId } = getAuth({ headers: request.headers });

    if (!userId) {
      console.error("Unauthorized: no userId in token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("User ID from auth:", userId);

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
