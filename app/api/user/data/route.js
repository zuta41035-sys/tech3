import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

// GET user data or create if not exist
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
        name: "New User",
        email: "",
        cartItems: {},
      });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Error in GET /api/user/data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST update user data
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    await connectDB();

    const { name, email, cartItems } = await request.json();

    if (!name && !email && !cartItems) {
      return NextResponse.json(
        { success: false, message: "Missing update fields" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (cartItems) updateData.cartItems = cartItems;

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Error in POST /api/user/data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
