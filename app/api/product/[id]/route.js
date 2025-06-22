import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function DELETE(request, { params }) {
  const { id } = params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  await connectDB();

  // Try to delete the product by ID
  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  // Return success response
  return NextResponse.json(
    { success: true, message: "Product deleted successfully" },
    { status: 200 }
  );
}
