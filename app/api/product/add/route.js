import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";

export async function POST(request) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });

    const isSeller = await authSeller(userId);
    if (!isSeller) return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const data = await request.json(); // Parse JSON body

    await connectDB();

    const newProduct = await Product.create({
      userId,
      name: data.name,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      offerPrice: Number(data.offerPrice),
      image: data.image, 
      date: Date.now(),
    });

    return NextResponse.json({ success: true, message: "Upload successful", newProduct });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
