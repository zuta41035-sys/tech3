import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
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

    // Check if user is admin
    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin access required" },
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

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    
    const orders = await Order.find(filter)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get customer info for each order
    const ordersWithCustomerInfo = await Promise.all(
      orders.map(async (order) => {
        try {
          const customer = await clerkClient.users.getUser(order.userId);
          return {
            ...order,
            customerInfo: {
              name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown User',
              email: customer.emailAddresses[0]?.emailAddress || 'No email',
              phone: customer.phoneNumbers[0]?.phoneNumber || 'No phone'
            }
          };
        } catch (error) {
          console.error(`Error fetching customer info for order ${order._id}:`, error);
          return {
            ...order,
            customerInfo: {
              name: 'Unknown User',
              email: 'No email',
              phone: 'No phone'
            }
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithCustomerInfo,
      totalPages,
      currentPage: page,
      totalOrders
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}