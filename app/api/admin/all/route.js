import { auth, clerkClient } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let user;
  try {
    user = await clerkClient.users.getUser(userId);
  } catch (e) {
    console.error("Failed to fetch user from Clerk", e);
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const isAdmin = user.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const status = searchParams.get("status") || "all";
  const limit = parseInt(searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;

  const filter = status === "all" ? {} : { orderStatus: status };

  try {
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find(filter)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      orders,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
