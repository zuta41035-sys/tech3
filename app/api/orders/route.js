import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

// GET USER ORDERS
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// CREATE ORDER
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // GET BODY
    const body = await request.json();

    console.log("ORDER BODY:", body);

    const {
      products,
      totalAmount,
      address,
      paymentMethod,
    } = body;

    // VALIDATION
    if (
      !products ||
      products.length === 0 ||
      totalAmount == null ||
      !address ||
      !paymentMethod
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required order data",
        },
        { status: 400 }
      );
    }

    // CREATE ORDER
    const newOrder = new Order({
      userId,

      products,

      totalAmount,

      address,

      paymentMethod,

      orderStatus: "pending",

      paymentStatus: "pending",

      orderDate: new Date(),
    });

    // SAVE
    const savedOrder = await newOrder.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: savedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}