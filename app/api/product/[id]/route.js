import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  await connectDB();

  const deleted = await Product.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Product deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(request, { params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const { name, description, price, offerPrice } = body;

    // Find existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Update only allowed fields, keep image and category same
    const updateData = {
      name,
      description,
      price,
      offerPrice,
      category: existingProduct.category,
      image: existingProduct.image,
    };

    const updated = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, message: "Product updated successfully", product: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
